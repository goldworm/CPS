import { IconBuilder, HttpProvider } from 'icon-sdk-js';
import IconService from 'icon-sdk-js';
import ids from './constants.js';
import store from '../Store';
import { customRequestRPC } from './CustomEvents';
import constants from './constants';

// var CPSScore = 'cx7c5aaa0b5e87c523aa3aa0a83fecc7e18d2b1797';

var CPSScore = 'cx724a3cf07c91a12dd7fd4987be130f383168b631';


// var testNet = "https://bicon.tracker.solidwallet.io/v3/address/info?address="
// var mainNet = "https://tracker.icon.foundation/v3/address/info?address="

// buyIcxAmount = IconAmount.of(IconAmount.of(Object.values(Object.values(tableData)[i])[2], IconAmount.Unit.LOOP).convertUnit(IconAmount.Unit.ICX)).toString();

export function call({
    scoreAddress = CPSScore,
    method,
    params = {},
    id
}) {
    let callBuilder = new IconBuilder.CallBuilder;
    let call = callBuilder
        .to(scoreAddress)
        .method(method)
        .params(params)
        .build();

    let jsonRpc = JSON.stringify({
        "jsonrpc": "2.0",
        "method": "icx_call",
        "params": call,
        "id": ids.method
    });

    window.dispatchEvent(customRequestRPC(jsonRpc));
}

export async function callKeyStoreWallet({
    scoreAddress = CPSScore,
    method,
    params = {},
}) {
    let callBuilder = new IconBuilder.CallBuilder;

    let call = callBuilder
        .to(scoreAddress)
        .method(method)
        .params(params)
        .build();

    const provider = new HttpProvider('https://bicon.net.solidwallet.io/api/v3');
    const iconService = new IconService(provider);
    console.log("callKeyStoreWallet start");
    const response = await iconService.call(call).execute();
    console.log("callKeyStoreWallet");
    console.log(response);
    return response;
}

export function sendTransaction({
    fromAddress = store.getState().account.address,
    scoreAddress = CPSScore,
    icxAmount = 0,
    method,
    params,

}) {

    const { IconConverter, IconBuilder, IconAmount } = IconService;
    const txnBuilder = new IconBuilder.CallTransactionBuilder();
    const txnData = txnBuilder
        .from(fromAddress)
        .to(scoreAddress)
        .nid(IconConverter.toBigNumber(3))
        .timestamp(new Date().getTime() * 1000)
        .stepLimit(IconConverter.toBigNumber(100000000))
        .version(IconConverter.toBigNumber(3))
        .method(method)
        .params(params)
        .value(IconAmount.of(icxAmount, IconAmount.Unit.ICX).toLoop())
        .build();

    const txnPayload = {
        jsonrpc: '2.0',
        method: 'icx_sendTransaction',
        params: IconConverter.toRawTransaction(txnData),
        id: constants[method],
    };
    console.log(txnPayload);
    window.parent.dispatchEvent(
        new CustomEvent('ICONEX_RELAY_REQUEST', {
            detail: {
                type: 'REQUEST_JSON-RPC',
                payload: txnPayload,
            },
        }),
    );
}