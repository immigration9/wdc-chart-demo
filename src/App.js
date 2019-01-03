import React, { Component } from 'react';
import { merge } from 'lodash/object';
import { ChartWrapper, ChartMediator } from 'whatap-designed-components';
import ColorSelector from 'whatap-designed-components/es/Chart/helper/ColorSelector';
import defaultOptions from './meta';

const createTimedata = (count, start, end) => {
  let out = [];

  for (let i = 0; i < count; i++) {
    let input = [];
    let time = parseInt(new Date().getTime() / 1000);
    let timestamp = (time * 1000)  - (i * 5 * 1000);
    input.push(timestamp);

    let random = Math.random() * 100;
    if (random < start) random = random + start;
    if (random > end)   random = (random % end) + end;

    input.push(random);

    out.push(input);
  }
  return out;
}

class App extends Component {
  constructor(props) {
    super(props);

    this.instances = 5;
    this.state = {
      data: [],
      theme: "wh",
      options: this.setOptions(),
    }

    this.charts = [];
  }

  setOptions = (custom) => {
    return merge({}, defaultOptions, custom ? custom : {});
  }

  setData = () => {
    let instances = this.instances;
    
    let out = [];
    for (let i = 0; i < instances; i++) {
      let oid = i
      out.push({
        key: oid,
        id: oid,
        label: `TC-${oid}`,
        data: createTimedata(30, 100 / instances * i, 100 / instances * (i + 1))
      })
    }

    this.setState({
      data: out
    })
  }

  setInstanceCount = (count) => {
    this.instances += count;

    this.setData();
  }

  componentDidMount() {
    this.setData();
  }

  handleChange = (e, id, cnt) => {
    ColorSelector.colorList.find((cl) => {
      if (cl.id === id) {
        cl.rgb[cnt] = Number(e.target.value)
      }
    })
    console.log(ColorSelector.colorList);
  }

  flush = (e) => {
    e.preventDefault();
    let that = this;

    console.log(this.charts);
    this.charts.forEach((chart) => {
      chart.loadData(that.state.data)
    })
  }

  getChartRef = (chart) => {
    ChartMediator.subscribe(chart);
    chart.mediator = ChartMediator;

    this.charts.push(chart);
  }

  changeTheme = () => {
    const { theme } = this.state;
    this.setState({
      theme: theme === "wh" ? "bk" : "wh"
    })
  }
  
  render() {
    return (
      <div style={{ display: 'flex' }}>
        <div style={{ width: '30%' }}>
          <div>
            <button onClick={() => this.setInstanceCount(1)}>인스턴스 증가</button>
            <button onClick={() => this.setInstanceCount(-1)}>인스턴스 감소</button>
          </div>
          {/* <div>
            <input />
            <button onClick={}></button>
          </div>
          <div>
            <input />
            <button onClick={}></button>
          </div> */}
          <div>
            { ColorSelector.colorList.map((cl) => {
              return (
                <div style={{ padding: '5px' }}>
                  <div style={{ display: 'inline-block', width: '50%' }}>
                    <span>{cl.id} | {cl.rgbStr}</span>
                  </div>
                  <div style={{ display: 'inline-block', width: '50%' }}>
                    <input onChange={(e) => this.handleChange(e, cl.id, 0)} defaultValue={cl.rgb[0]} style={{ width: '50px' }}></input>
                    <input onChange={(e) => this.handleChange(e, cl.id, 1)} defaultValue={cl.rgb[1]} style={{ width: '50px' }}></input>
                    <input onChange={(e) => this.handleChange(e, cl.id, 2)} defaultValue={cl.rgb[2]} style={{ width: '50px' }}></input>
                  </div>
                </div>
              )
            })}
          </div>
          <div>
            <button onClick={this.flush}>색상 적용</button>
          </div>
          <div>
            <button onClick={this.changeTheme}>테마 변경</button>
          </div>
        </div>
        <div style={{ width: '70%' }}>
          <div style={{ height: '250px', padding: '5px', border: `1px solid ${this.state.theme === "wh" ? 'white' : 'black'}`, backgroundColor: this.state.theme === "wh" ? 'white' : 'black'}} >
            <ChartWrapper 
              chartRef={this.getChartRef}
              id="chart_sample1"
              type="LineChart"
              data={this.state.data}
              theme={this.state.theme === "wh" ? "wh" : "bk" }
              options={this.state.options}
              />
          </div>
          <div style={{ height: '250px', padding: '5px', border: `1px solid ${this.state.theme === "wh" ? 'white' : 'black'}`, backgroundColor: this.state.theme === "wh" ? 'white' : 'black'}} >
            <ChartWrapper 
              chartRef={this.getChartRef}
              id="chart_sample2"
              type="LineChart"
              data={this.state.data}
              theme={this.state.theme === "wh" ? "wh" : "bk" }
              options={this.state.options}
              />
          </div>
          <div style={{ height: '250px', padding: '5px', border: `1px solid ${this.state.theme === "wh" ? 'white' : 'black'}`, backgroundColor: this.state.theme === "wh" ? 'white' : 'black'}} >
            <ChartWrapper 
              chartRef={this.getChartRef}
              id="chart_sample3"
              type="LineChart"
              data={this.state.data}
              theme={this.state.theme === "wh" ? "wh" : "bk" }
              options={this.state.options}
              />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
