export interface DashboardModel {
    orderDateTime?:any;
    tenant?:any;
    sales?:any;
    subTotal?:any;
    discount?:any;
    vat?:any;
    grandTotal?:any;
    amount_before_vat_discount?:any;
    currency?:any;
}

export interface Weather {  
    data: Array<number>;  
    label: string;  
}  
  
export interface WeatherForecast {  
    weatherList?: [];  
    chartLabels?: any;  
}


export interface SaleSummary {  
    data: Array<number>;  
    label: string; 
}  
  
export interface ChartsDataGateway {  
    saleSummary?: [];  
    chartLabels?: any;  
}

export interface PieChartsDataGateway {  
    countries: any;  
    population: any;  
}  