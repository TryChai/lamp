//数组处理
function splitData(rawData) {
  var datas = [];
  var times = [];
  var vols = [];
  var macds = [];
  var difs = [];
  var deas = [];
  var shou = [];
  for (var i = 0; i < rawData.length; i++) {
    datas.push(rawData[i]);
    times.push(rawData[i].splice(0, 1)[0]);
    vols.push(rawData[i][4]);
    macds.push(rawData[i][6]);
    difs.push(rawData[i][7]);
    deas.push(rawData[i][8]);
    shou.push(rawData[i][1]);
  }
  return {
    datas: datas,
    times: times,
    vols: vols,
    macds: macds,
    difs: difs,
    deas: deas,
    shou: shou,
  };
}

//MA计算公式
function calculateMA(dayCount, data) {
  var result = [];
  for (var i = 0, len = data.times.length; i < len; i++) {
    if (i < dayCount) {
      result.push("-");
      continue;
    }
    var sum = 0;
    for (var j = 0; j < dayCount; j++) {
      sum += parseFloat(data.datas[i - j][1]);
    }
    result.push((sum / dayCount).toFixed(2));
  }
  return result;
}

//分段计算
function fenduans(data) {
  var markLineData = [];
  var idx = 0;
  var tag = 0;
  var vols = 0;
  for (var i = 0; i < data.times.length; i++) {
    //初始化数据
    if (data.datas[i][5] != 0 && tag == 0) {
      idx = i;
      vols = data.datas[i][4];
      tag = 1;
    }
    if (tag == 1) {
      vols += data.datas[i][4];
    }
    if (data.datas[i][5] != 0 && tag == 1) {
      markLineData.push([
        {
          xAxis: idx,
          yAxis:
            data.datas[idx][1] > data.datas[idx][0]
              ? data.datas[idx][3].toFixed(2)
              : data.datas[idx][2].toFixed(2),
          value: vols,
        },
        {
          xAxis: i,
          yAxis:
            data.datas[i][1] > data.datas[i][0]
              ? data.datas[i][3].toFixed(2)
              : data.datas[i][2].toFixed(2),
        },
      ]);
      idx = i;
      vols = data.datas[i][4];
      tag = 2;
    }

    //更替数据
    if (tag == 2) {
      vols += data.datas[i][4];
    }
    if (data.datas[i][5] != 0 && tag == 2) {
      markLineData.push([
        {
          xAxis: idx,
          yAxis:
            data.datas[idx][1] > data.datas[idx][0]
              ? data.datas[idx][3].toFixed(2)
              : data.datas[idx][2].toFixed(2),
          value: (vols / (i - idx + 1)).toFixed(2) + " M",
        },
        {
          xAxis: i,
          yAxis:
            data.datas[i][1] > data.datas[i][0]
              ? data.datas[i][3].toFixed(2)
              : data.datas[i][2].toFixed(2),
        },
      ]);
      idx = i;
      vols = data.datas[i][4];
    }
  }
  return markLineData;
}

function k(data, isinit = true) {
  var start = 0;
  if (data.datas.length < 100) {
    start = 20;
  } else if (data.datas.length < 300) {
    start = 80;
  } else {
    start = 95;
  }

  if (isinit == true) {
    var datazoom = [
      {
        show: false,
        type: "inside",
        xAxisIndex: [0, 0],
        start: start,
        end: 100,
      },
      {
        show: false,
        type: "inside",
        xAxisIndex: [0, 1],
        start: start,
        end: 100,
      },
    ];
  } else {
    var datazoom = [
      {
        show: false,
        type: "inside",
        xAxisIndex: [0, 0],
        // start: start,
        // end: 100,
      },
      {
        show: false,
        type: "inside",
        xAxisIndex: [0, 1],
        // start: start,
        // end: 100,
      },
    ];
  }
  var option = {
    // backgroundColor: '#1a2431',
    backgroundColor: {
      type: "linear",
      x: 0, // 左上角x
      y: 0, // 左上角y
      x2: 0, // 右下角x
      y2: 1, // 右下角y
      colorStops: [
        {
          offset: 0,
          color: "#f7f8f9", // 0% 处的颜色
        },
        {
          offset: 1,
          color: "#f7f8f9", // 100% 处的颜色
        },
      ],
      global: false, // 缺省为 false
    },
    title: {
      text: "",
      left: 0,
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "line",
        lineStyle: {
          color: "#aaaaaa",
          width: 2, // K线x轴
        },
      },
      textStyle: {
        color: "#aaaaaa",
      },
    },
    legend: {
      data: ["KLine", "MA5", "MA10", "MA20", "MA30"],
      selected: {
        MA5: false,
        MA10: false,
        MA20: false,
        MA30: false,
      },
      selectedMode: "single",
      height: "auto",
      textStyle: {
        //标签颜色
        fontSize: 10,
        color: "#6d88a6",
      },
    },
    grid: [
      {
        left: "13%",
        right: "5%",
        top: "10%",
        height: "60%",
      },
      {
        left: "13%",
        right: "5%",
        top: "77%",
        height: "18%",
      },
    ],
    xAxis: [
      {
        type: "category",
        data: data.times,
        scale: true,
        // boundaryGap: false,
        axisLine: {
          onZero: false,
          lineStyle: {
            color: "#dddddd",
            width: 1, // K线x轴
          },
        },
        axisTick: {
          //刻度线
          show: true,
          lineStyle: {
            color: "#dddddd",
            width: 1, // K线x轴
          },
        },
        axisLabel: {
          show: true,
          textStyle: {
            fontSize: 10,
            color: "#6d88a6",
          },
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: ["#dddddd"],
            width: 1,
            type: "solid",
          },
        },
        splitNumber: 20,
        min: "dataMin",
        max: "dataMax",
      },
      {
        type: "category",
        gridIndex: 1,
        data: data.times,
        axisLabel: {
          show: false,
          textStyle: {
            fontSize: 10,
            color: "#6d88a6",
          },
        },
        axisTick: {
          //刻度线
          show: false,
          lineStyle: {
            color: "#223347",
            width: 1, // K线x轴
          },
        },
        axisLine: {
          onZero: false,
          lineStyle: {
            color: "#223347",
            width: 1, // K线x轴
          },
        },
      },
    ],
    yAxis: [
      {
        scale: true,
        splitArea: {
          show: false,
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: ["#dddddd"],
            width: 1,
            type: "solid",
          },
        },
        axisLine: {
          onZero: false,
          lineStyle: {
            color: "#dddddd",
            width: 1, //这里是为了突出显示加上的
          },
        },
        axisTick: {
          //刻度线
          show: true,
          lineStyle: {
            color: "#dddddd",
            width: 1, // K线x轴
          },
        },
        axisLabel: {
          show: true,
          textStyle: {
            fontSize: 10,
            color: "#6d88a6",
          },
        },
      },
      {
        gridIndex: 1,
        splitNumber: 3,
        axisLine: {
          onZero: false,
          lineStyle: {
            color: "#dddddd",
            width: 1, //这里是为了突出显示加上的
          },
        },
        axisTick: {
          show: false,
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: ["#dddddd"],
            width: 1,
            type: "solid",
          },
        },
        axisLabel: {
          show: true,
          textStyle: {
            fontSize: 10,
            color: "#6d88a6",
          },
        },
      },
    ],
    dataZoom: datazoom,
    series: [
      {
        name: "KLine",
        type: "candlestick",
        data: data.datas,
        barMaxWidth: 20,
        itemStyle: {
          normal: {
            color: "#03ad90",
            color0: "#d14b64",
            borderColor: "#03ad90",
            borderColor0: "#d14b64",
            fontSize: "12px",
          },
        },
        markArea: {
          silent: true,
          itemStyle: {
            normal: {
              color: "Honeydew",
            },
          },
          data: fenduans(data),
        },
        markPoint: {
          data: [
            {
              type: "max",
              name: "最大值",
            },
            {
              type: "min",
              name: "最小值",
            },
          ],
          itemStyle: {
            normal: {
              label: {
                show: true,
                color: "#f3f3f3", //气泡中字体颜色
              },
            },
          },
        },
        markLine: {
          label: {
            normal: {
              position: "middle",
              textStyle: {
                color: "Blue",
                fontSize: 15,
              },
            },
          },
          data: fenduans(data),
          symbol: ["circle", "none"],
        },
      },
      {
        name: "MA5",
        type: "line",
        data: calculateMA(5, data),
        smooth: true,
        lineStyle: {
          normal: {
            opacity: 0.5,
          },
        },
      },
      {
        name: "MA10",
        type: "line",
        data: calculateMA(10, data),
        smooth: true,
        lineStyle: {
          normal: {
            opacity: 0.5,
          },
        },
      },
      {
        name: "MA20",
        type: "line",
        data: calculateMA(20, data),
        smooth: true,
        lineStyle: {
          normal: {
            opacity: 0.5,
          },
        },
      },
      {
        name: "MA30",
        type: "line",
        data: calculateMA(30, data),
        smooth: true,
        lineStyle: {
          normal: {
            opacity: 0.5,
          },
        },
      },
      {
        name: "Volumn",
        type: "bar",
        xAxisIndex: 1,
        yAxisIndex: 1,
        data: data.vols,
        barMaxWidth: 20,
        itemStyle: {
          normal: {
            color: function (params) {
              var colorList;
              if (
                data.datas[params.dataIndex][1] >
                data.datas[params.dataIndex][0]
              ) {
                colorList = "#03ad90";
              } else {
                colorList = "#d14b64";
              }
              return colorList;
            },
          },
        },
      },
    ],
  };
  return option;
}

function f(data) {
  var option = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        animation: false,
      },
    },
    grid: [
      {
        left: "10%",
        right: "5%",
        top: "10%",
        height: "60%",
      },
      {
        left: "10%",
        right: "5%",
        top: "77%",
        height: "18%",
      },
    ],
    xAxis: [
      // {
      //   type: 'category',
      //   data: data.times,
      //   boundaryGap: false
      // },
      {
        type: "category",
        gridIndex: 1,
        data: data.times,
        axisLabel: {
          show: false,
          textStyle: {
            color: "#6d88a6",
          },
        },
      },
    ],
    yAxis: [
      {
        scale: true,
        splitArea: {
          show: false,
        },
      },
      {
        gridIndex: 1,
        splitNumber: 3,
        axisLine: {
          onZero: false,
          lineStyle: {
            color: "#223347",
            width: 1, //这里是为了突出显示加上的
          },
        },
        axisTick: {
          show: false,
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: ["#1e2d44"],
            width: 1,
            type: "solid",
          },
        },
        axisLabel: {
          show: true,
          textStyle: {
            color: "#6d88a6",
          },
        },
      },
    ],
    dataZoom: [
      {
        show: false,
        type: "inside",
        xAxisIndex: [0, 0],
        start: 93,
        end: 100,
      },
      {
        show: false,
        type: "inside",
        xAxisIndex: [0, 1],
        start: 93,
        end: 100,
      },
    ],
    series: [
      {
        name: "fenshi",
        type: "line",
        showSymbol: false,
        hoverAnimation: false,
        areaStyle: {
          shadowColor: "#20253a",
          shadowBlur: 1,
        },
        data: data.shou,
      },
      {
        name: "Volumn",
        type: "bar",
        xAxisIndex: 1,
        yAxisIndex: 1,
        data: data.vols,
        itemStyle: {
          normal: {
            color: function (params) {
              var colorList;
              if (
                data.datas[params.dataIndex][1] >
                data.datas[params.dataIndex][0]
              ) {
                colorList = "#d14b64";
              } else {
                colorList = "#03ad90";
              }
              return colorList;
            },
          },
        },
      },
    ],
  };
  return option;
}

export default {
  splitData,
  calculateMA,
  fenduans,
  k,
  f,
};
