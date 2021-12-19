import React, { useState, useEffect } from "react";
import axios from "axios";
import "./LatestTransactions.css";

const apiKey = "6XPUZK2YPSIERYAQKIMTQ6VW38ZVIVA2QW";

const endpoint = `https://api-goerli.etherscan.io/api`;

export default function LatestTransactions(props) {
  const [txs, setTxs] = useState([]);

  useEffect(() => {
    getTxs();
  }, []);

  async function getTxs() {
    // get the block transaction
    const blockDetail = await axios.get(
      endpoint +
        `?module=proxy&action=eth_getBlockByNumber&tag=0x5c27f5&boolean=true&apikey=${apiKey}`
    );

    const { transactions } = blockDetail.data.result;

    let txsDetails = [];

    for (let i = 0; i < 5; i = i + 1) {
      const tx = transactions[i];
      txsDetails.push({
        tx: tx.hash,
        from: tx.from,
        to: tx.to,
        value: tx.value,
      });
    }

    setTxs(txsDetails);
  }

  return (
    <div className="latestBlock">
      <div className="headingDiv">
        <span>Latest Transactions</span>
      </div>

      {txs.map((data) => {
        return (
          <div className="blockData">
            <div className="block">
              <span className="blockIcon">Tx</span>
              <span className="blockName">{data.tx.slice(0, 16) + "..."}</span>
            </div>
            <div className="minerDiv">
              <span className="minerName">
                <b>from:</b> {"     "}
                {data.from.slice(0, 7) + "..."}
              </span>
              <span className="minerName">
                {" "}
                <b>to:</b> {"     "}
                {data.to.slice(0, 7) + "..."}
              </span>
            </div>
            <div className="sizeDiv">
              <span className="sizeIcon">Eth</span>
              <span className="sizeValue">
                {parseInt(data.value) / 10 ** 18}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
