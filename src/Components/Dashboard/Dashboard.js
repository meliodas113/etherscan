import React, { useState, useEffect } from "react";
import axios from "axios";
import LatestBlock from "./LatestBlock/LatestBlock";
import "./Dashboard.css";
import { FaEthereum, FaDollarSign, FaBtc, FaGlobeAsia } from "react-icons/fa";
import { SiHiveBlockchain } from "react-icons/si";
import { RiSettings3Fill } from "react-icons/ri";
import LatestTransactions from "./LatestTransactions/LatestTransactions";

const apiKey = "6XPUZK2YPSIERYAQKIMTQ6VW38ZVIVA2QW";

const endpoint = `https://api-goerli.etherscan.io/api`;

export default function Dashboard() {
  const [ethUSD, setEthUSD] = useState("");
  const [ethBTC, setEthBTC] = useState("");
  const [blockNo, setBlockNo] = useState("");
  const [latestBlock, setLatestBlock] = useState(0);
  const [difficulty, setDifficulty] = useState("");
  const [marketCap, setMarketCap] = useState(0);

  async function fetchData() {
    axios
      .get(endpoint + `?module=stats&action=ethprice&apikey=${apiKey}`)
      .then(function (response) {
        const result = response.data.result;
        setEthUSD(result.ethusd);
        setEthBTC(result.ethbtc);
        axios
          .get(endpoint + `?module=stats&action=ethsupply&apikey=${apiKey}`)
          .then(function (response) {
            const priceWei = response.data.result.toString();
            const priceEth = priceWei.slice(0, priceWei.length - 18);
            const marketCap = parseInt(priceEth) * result.ethusd;
            setMarketCap(marketCap);
          })
          .catch(function (error) {
            console.log(error);
          });
      })
      .catch(function (error) {
        console.log(error);
      });

    axios
      .get(endpoint + `?module=proxy&action=eth_blockNumber&apikey=${apiKey}`)
      .then(function (response) {
        setLatestBlock(parseInt(response.data.result));
        setBlockNo(response.data.result);
        axios
          .get(
            endpoint +
              `?module=proxy&action=eth_getBlockByNumber&tag=${response.data.result}&boolean=true&apikey=${apiKey}`
          )
          .then(function (response) {
            const difficulty = parseInt(
              response.data.result.difficulty
            ).toString();
            const difficultyTH = `${difficulty} TH`;
            setDifficulty(difficultyTH);
          })
          .catch(function (error) {
            console.log(error);
          });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="MainDiv">
      <div className="HeaderDiv">
        <span className="Icon">
          <FaEthereum />
        </span>
        <span className="Heading">Ethereum</span>
      </div>
      <div className="StatsDiv">
        <div className="Card">
          <span className="CardName">
            <FaEthereum />
            {"  "}
            <span className="CardText">Ether Price</span>
          </span>
          <span className="CardDesc">
            <FaDollarSign />
            <span className="ethUSD">{ethUSD}</span>
            {"  "}
            <span>@</span>
            {"  "}
            <span className="ethBTC">{ethBTC}</span>
            {"  "}
            <FaBtc />
          </span>
        </div>
        <div className="Card">
          <span className="CardName">
            <SiHiveBlockchain />
            {"  "}
            <span className="CardText">Latest Block</span>
          </span>
          <span className="CardDesc">
            <SiHiveBlockchain />
            <span className="ethUSD">{latestBlock}</span>
          </span>
        </div>
        <div className="Card">
          <span className="CardName">
            <RiSettings3Fill />
            {"  "}
            <span className="CardText">Difficulty</span>
          </span>
          <span className="CardDesc">
            <span className="ethUSD">2414.95 TH</span>
          </span>
        </div>
        <div className="Card">
          <span className="CardName">
            <FaGlobeAsia />
            {"  "}
            <span className="CardText">Market Cap</span>
          </span>
          <span className="CardDesc">
            <FaDollarSign />
            <span className="ethUSD">{marketCap}</span>
          </span>
        </div>
      </div>
      <div className="tableDiv">
        <LatestBlock latestBlock={latestBlock} />
        <LatestTransactions blockNo={blockNo} />
      </div>
    </div>
  );
}
