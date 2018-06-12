import {Doughnut} from 'react-chartjs-2';

export default class Chart extends React.Component {
    constructor() {
        super()
        this.state = {
            chartData:{
                labels: [],
                datasets:[
                 {
                 label:'Votes',
                    data:[],
                    backgroundColor:[
                    ]
                  }
        ]
                
            }
        }
    }
    
    static  getDerivedStateFromProps(nextProps, prevState) {
        return ({chartData: {labels: nextProps.questions,
                             datasets: [{label: 'Votes',
                             data: nextProps.answers,
                             backgroundColor:[
                                          'rgba(255, 99, 132, 0.6)',
                                          'rgba(54, 162, 235, 0.6)',
                                          'rgba(255, 206, 86, 0.6)',
                                          'rgba(75, 192, 192, 0.6)',
                                          'rgba(153, 102, 255, 0.6)',
                                          'rgba(255, 159, 64, 0.6)',
                                          'rgba(255, 99, 132, 0.6)'
                                        ]}]}})
                        }
    
    render() {
        return (
            <div className = {'pollChart'}>
                <Doughnut className = "myChart" data = {this.state.chartData} options ={{maintainAspectRatio: true}} />
            </div>
            )
    }
}
