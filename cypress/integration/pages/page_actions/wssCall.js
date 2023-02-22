const { execute } = require("apollo-link")
const { WebSocketLink } = require("apollo-link-ws")
import { ws } from 'ws'
const { SubscriptionClient } = require('subscriptions-transport-ws')
let res
class wss {

    static wssCall() {
        const client = this.createSubscriptionObservable('subscriptionURL', 'token', 'queryValue', 'report')
        let eventNum = 0
        client.subscribe(eventData => {
            let test = eventData.data.report.sectionType
            if (test == value) {
                res = eventData.eventData
            }
            eventNum++
        })
    }

    static createSubscriptionObservable = (wsURL, authToken, quer, reportType) => {
        const link = new WebSocketLink(this.getWsClient(wsURL, authToken))
        return execute(link, { query: quer, operationName: reportType, variables: var_data })
    }

    static getWsClient = (wsURL,authToken)=>{
        const client = new SubscriptionClient(wsURL,{
            reconnect: true,
            connectionParams:{
                "authorization":"Bearer " + authToken,
                "content-type": "application/json"
            }
        }, ws)
        return client;
    }
}