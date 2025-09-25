import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

const DashboardContent = () => {
    const chartRef = useRef(null);
  
    useEffect(() => {
      let myChart;
      if (chartRef.current) {
        myChart = echarts.init(chartRef.current);
        const option = {
          animation: false,
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data: ['Completed', 'In Progress']
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
          },
          yAxis: {
            type: 'value'
          },
          series: [
            {
              name: 'Completed',
              type: 'line',
              data: [10, 15, 20, 25, 22, 28, 30],
              color: '#4F46E5'
            },
            {
              name: 'In Progress',
              type: 'line',
              data: [5, 8, 12, 15, 18, 20, 25],
              color: '#60A5FA'
            }
          ]
        };
        myChart.setOption(option);
      }
      return () => {
        if (myChart) myChart.dispose();
      };
    }, []);
  
    return (
      <main className="flex-1 overflow-y-auto bg-gray-50">
        <div className="py-6">
          <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
  
            {/* Summary Cards */}
            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <i className="fas fa-folder text-custom text-3xl"></i>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Total Projects</dt>
                        <dd className="flex items-baseline">
                          <div className="text-2xl font-semibold text-gray-900">12</div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
  
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <i className="fas fa-tasks text-custom text-3xl"></i>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Active Tasks</dt>
                        <dd className="flex items-baseline">
                          <div className="text-2xl font-semibold text-gray-900">34</div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
  
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <i className="fas fa-clock text-custom text-3xl"></i>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Hours Tracked</dt>
                        <dd className="flex items-baseline">
                          <div className="text-2xl font-semibold text-gray-900">164</div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
  
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <i className="fas fa-users text-custom text-3xl"></i>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Team Members</dt>
                        <dd className="flex items-baseline">
                          <div className="text-2xl font-semibold text-gray-900">8</div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>
  
            {/* Detailed Sections */}
            <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div className="bg-white shadow rounded-lg">
                <div className="p-6">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">Project Progress</h3>
                  <div className="mt-2">
                    <div ref={chartRef} style={{ height: '300px' }}></div>
                  </div>
                </div>
              </div>
  
              <div className="bg-white shadow rounded-lg">
                <div className="p-6">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">Recent Activities</h3>
                  <div className="flow-root mt-6">
                    <ul className="-mb-8">
                      <li className="relative pb-8">
                        <div className="relative flex space-x-3">
                          <div>
                            <span className="h-8 w-8 rounded-full bg-custom flex items-center justify-center ring-8 ring-white">
                              <i className="fas fa-check text-white"></i>
                            </span>
                          </div>
                          <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                            <div>
                              <p className="text-sm text-gray-500">
                                Completed task <span className="font-medium text-gray-900">Website Redesign</span>
                              </p>
                            </div>
                            <div className="text-right text-sm whitespace-nowrap text-gray-500">
                              <time dateTime="2023-09-20">1h ago</time>
                            </div>
                          </div>
                        </div>
                      </li>
                      <li className="relative pb-8">
                        <div className="relative flex space-x-3">
                          <div>
                            <span className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center ring-8 ring-white">
                              <i className="fas fa-plus text-white"></i>
                            </span>
                          </div>
                          <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                            <div>
                              <p className="text-sm text-gray-500">
                                New task added to <span className="font-medium text-gray-900">Mobile App Development</span>
                              </p>
                            </div>
                            <div className="text-right text-sm whitespace-nowrap text-gray-500">
                              <time dateTime="2023-09-20">3h ago</time>
                            </div>
                          </div>
                        </div>
                      </li>
                      <li className="relative pb-8">
                        <div className="relative flex space-x-3">
                          <div>
                            <span className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center ring-8 ring-white">
                              <i className="fas fa-user text-white"></i>
                            </span>
                          </div>
                          <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                            <div>
                              <p className="text-sm text-gray-500">
                                New team member <span className="font-medium text-gray-900">Sarah Johnson</span> joined
                              </p>
                            </div>
                            <div className="text-right text-sm whitespace-nowrap text-gray-500">
                              <time dateTime="2023-09-20">6h ago</time>
                            </div>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
  
          </div>
        </div>
      </main>
    );
  };

  export default DashboardContent;