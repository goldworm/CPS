import { IconBuilder, HttpProvider } from 'icon-sdk-js';
import IconService from 'icon-sdk-js';
import ids from './constants.js';
import store from '../Store';
import { customRequestRPC } from './CustomEvents';
import constants from './constants';


// var CPSScore = 'cx724a3cf07c91a12dd7fd4987be130f383168b631';
// var CPSScore = 'cxdf3c1ea6ba87e21957c63b21a54151a38a6ecb80';
// var CPSScore = 'cx00c1e2d9b009fca69002c53c1ce3ed377708381e';
// var CPSScore = 'cx6bb0e6683dd326165d42289c12b6bd0eaa596cc9';
var CPSScore = 'cxa4b044b17158b964ed529a72d024eea80ac46944';

export const provider = new HttpProvider('https://bicon.net.solidwallet.io/api/v3');
export const iconService = new IconService(provider);

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
    // console.log("cpsTreasuryScoreAddressKeyStore", scoreAddress);
    let callBuilder = new IconBuilder.CallBuilder;

    let call = callBuilder
        .to(scoreAddress)
        .method(method)
        .params(params)
        .build();

    // const provider = new HttpProvider('https://zicon.net.solidwallet.io/api/v3');
    // console.log("callKeyStoreWallet start");
    const response = await iconService.call(call).execute();
    // console.log("callKeyStoreWallet");
    // console.log(response);
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


export function signTransaction() {

  return new Promise((resolve, reject) => {
      const signature = store.getState().account.signature;
      if (signature) {
          resolve(signature);
          return;
      }
      signTransactionFromICONEX();

      const interFunction = () => {
        const signature = store.getState().account.signature;
        if (signature) {
          clearInterval(interFunction);
          resolve(signature);
          return;
            }
        
      }

      setInterval(interFunction, 100)
  })
}

function getRanHex(size) {
    return(
        [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('')
    )
}

export function signTransactionFromICONEX() {
    
    window.parent.dispatchEvent(new CustomEvent('ICONEX_RELAY_REQUEST', {
        detail: {
            type: 'REQUEST_SIGNING',
            payload: {
                from: store.getState().account.address,
                // hash: "9babe5d2911e8e42dfad72a589202767f95c6fab49523cdc1621607529890125", //64 characters
                hash: getRanHex(51) + new Date().getTime()

            }
        }
    }))
}