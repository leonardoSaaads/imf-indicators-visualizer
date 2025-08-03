// src/pages/Dashboard.jsx
import { useState } from 'react';
import { Header } from '../components/layout/Header';
import { Sidebar } from '../components/layout/Sidebar';
import { IndicatorSelector } from '../components/data/IndicatorSelector';
import { CountrySelector } from '../components/data/CountrySelector';
import { PeriodSelector } from '../components/data/PeriodSelector';
import { ComparisonChart } from '../components/charts/ComparisonChart';
import { IMFAreaChart } from '../components/charts/AreaChart';
import { StatisticsPanel } from '../components/charts/StatisticsPanel';
import { MetricCard } from '../components/charts/MetricCard';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Alert } from '../components/ui/Alert';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { useTimeSeries } from '../hooks/useIMFData';

export const Dashboard = () => {
  const [selectedIndicator, setSelectedIndicator] = useState('');
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [selectedPeriods, setSelectedPeriods] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState('charts'); // 'charts' ou 'statistics'

  const { data, loading, error, fetchTimeSeries } = useTimeSeries();

  const handleAnalyze = async () => {
    if (!selectedIndicator || selectedCountries.length === 0 || selectedPeriods.length === 0) {
      return;
    }

    setIsAnalyzing(true);
    try {
      const result = await fetchTimeSeries(selectedIndicator, selectedCountries, selectedPeriods);
      
      // Transformar dados para formato de gráfico
      const transformedData = transformDataForChart(result, selectedCountries, selectedPeriods);
      setChartData(transformedData);
    } catch (err) {
      console.error('Erro ao buscar dados:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const transformDataForChart = (apiData, countries, periods) => {
    if (!apiData?.values) return [];

    const chartData = [];
    
    periods.forEach(period => {
      const dataPoint = { period };
      
      countries.forEach(country => {
        const countryData = apiData.values[selectedIndicator]?.[country];
        if (countryData && countryData[period]) {
          dataPoint[country] = parseFloat(countryData[period]);
        }
      });
      
      chartData.push(dataPoint);
    });

    return chartData.filter(point => 
      Object.keys(point).length > 1 // Pelo menos período + um valor
    );
  };

  const getLatestMetrics = () => {
    if (!data?.values || selectedCountries.length === 0 || selectedPeriods.length === 0) {
      return [];
    }

    const metrics = [];
    const latestPeriod = selectedPeriods[selectedPeriods.length - 1];
    const previousPeriod = selectedPeriods[selectedPeriods.length - 2];

    selectedCountries.forEach(country => {
      const countryData = data.values[selectedIndicator]?.[country];
      if (countryData) {
        const currentValue = countryData[latestPeriod];
        const previousValue = countryData[previousPeriod];
        
        let change = undefined;
        if (currentValue && previousValue) {
          change = ((currentValue - previousValue) / previousValue * 100).toFixed(2);
        }

        if (currentValue) {
          metrics.push({
            country,
            value: parseFloat(currentValue),
            change: parseFloat(change),
            period: latestPeriod
          });
        }
      }
    });

    return metrics;
  };

  // Função para determinar se deve usar gráfico empilhado
  const shouldUseStackedArea = () => {
    // Use empilhado para indicadores que representam partes de um todo
    // ou valores que fazem sentido somar (como população, PIB absoluto)
    const stackedIndicators = ['LP', 'NGDP', 'NGDPD', 'GDP'];
    return stackedIndicators.some(indicator => 
      selectedIndicator.includes(indicator)
    );
  };

  // Função para obter título apropriado para o gráfico de área
  const getAreaChartTitle = () => {
    const isStacked = shouldUseStackedArea();
    if (isStacked) {
      return `Distribuição Proporcional - ${selectedIndicator}`;
    }
    return `Comparação de Tendências - ${selectedIndicator}`;
  };

  const canAnalyze = selectedIndicator && selectedCountries.length > 0 && selectedPeriods.length > 0;

  // Função para renderizar abas
  const TabButton = ({ id, label, icon, isActive, onClick }) => (
    <button
      onClick={() => onClick(id)}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
        isActive 
          ? 'bg-blue-600 text-white shadow-md' 
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800'
      }`}
    >
      <span className="text-lg">{icon}</span>
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="flex relative">
        <Sidebar>
          <div className="space-y-6">
            <Card title="Indicador" className="border border-gray-200 shadow-sm bg-white rounded-xl">
              <IndicatorSelector
                value={selectedIndicator}
                onChange={setSelectedIndicator}
              />
            </Card>

            <Card title="Países/Regiões" className="border border-gray-200 shadow-sm bg-white rounded-xl">
              <CountrySelector
                value={selectedCountries}
                onChange={setSelectedCountries}
                multiple={true}
              />
            </Card>

            <Card title="Período" className="border border-gray-200 shadow-sm bg-white rounded-xl">
              <PeriodSelector
                value={selectedPeriods}
                onChange={setSelectedPeriods}
              />
            </Card>

            <Button
              onClick={handleAnalyze}
              disabled={!canAnalyze || isAnalyzing}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAnalyzing ? (
                <div className="flex items-center justify-center gap-2">
                  <LoadingSpinner size="sm" />
                  Analisando...
                </div>
              ) : (
                'Analisar Dados'
              )}
            </Button>
          </div>
        </Sidebar>

        <main className="flex-1 min-h-screen lg:ml-0">
          <div className="p-4 lg:p-6 pt-16 lg:pt-6">
            <div className="max-w-7xl mx-auto space-y-6">
              {error && (
                <Alert type="error" title="Erro ao carregar dados">
                  {error}
                </Alert>
              )}

              {!canAnalyze && !loading && (
                <Card className="text-center py-12 border border-gray-200 shadow-sm bg-white rounded-xl">
                  <div className="text-gray-500">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">
                        <img 
                          src="/World_Data.svg" 
                          alt="World Data Visualization"
                          className="w-full h-full object-contain"
                        />
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-gray-900">Bem-vindo ao IMF Data Visualizer</h3>
                    <p className="text-gray-600 max-w-md mx-auto">
                      Selecione um indicador, países e período no painel lateral para começar sua análise de dados econômicos.
                    </p>
                  </div>
                </Card>
              )}

              {chartData.length > 0 && (
                <>
                  {/* Métricas resumidas */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {getLatestMetrics().map((metric) => (
                      <MetricCard
                        key={metric.country}
                        title={metric.country}
                        value={metric.value}
                        change={metric.change}
                        period={selectedPeriods[selectedPeriods.length - 2]}
                        loading={loading}
                      />
                    ))}
                  </div>

                  {/* Navegação por abas */}
                  <div className="flex justify-center">
                    <div className="flex gap-2 p-1 bg-gray-50 rounded-lg border border-gray-200">
                      <TabButton
                        id="charts"
                        label="Visualizações"
                        icon={
                          <div className="bg-gray-100 rounded-md p-1">
                            <img src="/dashboard-icon.svg" alt="Visualizações" className="w-5 h-5" />
                          </div>
                        }
                        isActive={activeTab === 'charts'}
                        onClick={setActiveTab}
                      />
                      <TabButton
                        id="statistics"
                        label="Análise Estatística"
                        icon={
                          <div className="bg-gray-100 rounded-md p-1">
                            <img src="/statistics-icon.svg" alt="Estatísticas" className="w-5 h-5" />
                          </div>
                        }
                        isActive={activeTab === 'statistics'}
                        onClick={setActiveTab}
                      />
                    </div>
                  </div>

                  {/* Conteúdo das abas */}
                  {activeTab === 'charts' && (
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                      <Card className="border border-gray-200 shadow-sm bg-white rounded-xl">
                        <ComparisonChart
                          data={chartData}
                          countries={selectedCountries}
                          indicator={selectedIndicator}
                          title="Evolução Temporal Comparativa"
                          height={400}
                        />
                      </Card>
                      
                      <Card className="border border-gray-200 shadow-sm bg-white rounded-xl">
                        <IMFAreaChart
                          data={chartData}
                          countries={selectedCountries}
                          title={getAreaChartTitle()}
                          height={400}
                          stacked={shouldUseStackedArea()}
                          showGrid={true}
                          showLegend={true}
                        />
                      </Card>
                    </div>
                  )}

                  {activeTab === 'statistics' && (
                    <StatisticsPanel
                      data={chartData}
                      countries={selectedCountries}
                      selectedIndicator={selectedIndicator}
                      className="w-full"
                    />
                  )}

                  {/* Tabela de dados (sempre visível) */}
                  <Card title="Dados Detalhados" className="border border-gray-200 shadow-sm bg-white rounded-xl">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                              Período
                            </th>
                            {selectedCountries.map(country => (
                              <th key={country} className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                {country}
                              </th>
                            ))}
                            {selectedCountries.length > 1 && shouldUseStackedArea() && (
                              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Total
                              </th>
                            )}
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {chartData.map((row, index) => {
                            const total = selectedCountries.reduce((sum, country) => 
                              sum + (row[country] || 0), 0
                            );
                            
                            return (
                              <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                  {row.period}
                                </td>
                                {selectedCountries.map(country => (
                                  <td key={country} className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                    {row[country] ? row[country].toLocaleString('pt-BR', {
                                      minimumFractionDigits: 0,
                                      maximumFractionDigits: 2
                                    }) : '-'}
                                  </td>
                                ))}
                                {selectedCountries.length > 1 && shouldUseStackedArea() && (
                                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 bg-gray-25">
                                    {total > 0 ? total.toLocaleString('pt-BR', {
                                      minimumFractionDigits: 0,
                                      maximumFractionDigits: 2
                                    }) : '-'}
                                  </td>
                                )}
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </Card>
                </>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};