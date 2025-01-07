# Project Description
DEMO: https://www.youtube.com/watch?v=KzMw3NSDE5E

## **Inspiration**

I was inspired to create this supply chain solution when my mother(who works in an SME) explained her problems with the supply chain system to me. I noted that there were too many “trusted” central authorities involved in this process. The entire process was highly fragmented.

When I did research on supply chain solutions that SMEs can use, I found none. I only found research papers discussing the ideas and enterprise solutions that SMEs cannot afford.


### **Challenges in the traditional supply chain system**

* Time is wasted in exchange of documents and information through email.
* Remittances are delayed because transactions must pass through a bank. Moreover, the bank must be trusted as a central authority.
* The transparency system is person based, not process based. Trust in the traditional supply chain system is based on people rather than processes.


## **What it does**

The app involves 4 types of accounts (Buyers, Suppliers, Shipping Lines, Traders). Each account involved in an order can view its status, allowing for full transparency. I expressed money amounts in the app in USD, so that it is easier for users to decide amounts. The emails of all accounts involved in an order are also visible, so that anyone can contact personally them if necessary.

The app works as follows:



1. First, the buyer creates an order, selecting a trader from the list of all traders, specifying an amount they will pay to the trader, the advance payment percent they will give for the trader, the commodity they require, the quantity of goods they require and a unit for those goods.
2. Next, the buyer and trader negotiate the amount given to the trader and the advance payment percent for the trader. When the buyer accepts the order details, they must pay the trader the advance payment. If they don’t do so, the order won’t.
3. Afterwards, the trader will find a supplier to produce the goods the trader requires, specifying an amount they will pay to the supplier and an advance payment percent for the supplier. The supplier and trader can negotiate these two details. When the trader accepts the order details, they must pay the supplier the advance payment. If they don’t do so, the order won’t continue.
4. Now, the supplier will begin production. Throughout production, the supplier would update the status of production. The accounts involved in the order can contact the supplier about the status through their email. Once production is complete, the supplier must provide a packing list (PL) and invoice, while also specifying the final quantity of goods they could produce. The final quantity can only be 10% more or less than the original quantity specified by the buyer.
5. Then, the supplier will find a shipping line to ship the produced goods. The shipping line would specify the amount they will ship the produced goods for. The shipping line and supplier can negotiate the amount. When the supplier accepts the price given by the shipping line, they must pay the shipping line the amount. The order wouldn't continue if they didn't do so. This is how the shipping line gets paid.
6. Later, the shipping line would upload the BL. Once the goods are shipped, they would update the status to be shipped.
7. Thereupon, the trader can view the documents. They cannot download/update them until they verify the documents and pay the supplier the amount after deducting the advance payment. Once the trader pays the supplier, they can download the documents for customs and update the documents. This is how the supplier gets paid.
8. Once the trader updates the documents, the buyer can view them. To download the documents for use at customs, the buyer must verify the trader’s documents and pay the trader the amount after deducting the advance payment. This is how the trader gets paid. Finally, when the buyer receives the goods, he can close the order.


## **How I built it**

I built the smart contract for this app using Solidity and I deployed the contract on the Polygon Mumbai Testnet. I built the app with the Truffle full stack dApp development framework. I used React and JavaScript for the frontend. I used web3.js to interact with the smart contract. 

I used AWS Amplify for deployment and for its database. I stored some information about users in the AWS Amplify database and I interacted with this information using GraphQL. I did this because some of this information(namely 100 word descriptions of users) would be too large for the blockchain. I also did this because it is much faster and easier to query an AWS database than it is to create a custom data structure to query in Solidity.

Other than that, I used IPFS/web3.storage to store documents involved in the order in a decentralised manner. I used Chainlink Data Feeds to get and display the live value of 1 MATIC in USD.


## **Challenges I ran into**

My smart contract is extremely large(over 700 lines of code) so I constantly got warnings informing me that my contract may not be deployable. To prevent this, I used various optimisations in my smart contract to reduce its size. At one point, I tried splitting my smart contract into various children contracts using inheritance, but I realised that this wouldn’t work because inherited contracts don’t share storage. The smart contract’s deployment took multiple hours, but it was finally done.

This is the first time I am using a lot of the technologies I have used in this project(IPFS, GraphQL, AWS Amplify, Chainlink, Polygon). As a result, I took some time to learn how to use the technologies. 


## **Accomplishments that I’m proud of**

I’m proud that, despite how many of the technologies I used were new to me, I could use them effectively. Although this was my first self-developed dApp, I could create a sizable full-stack application.


## **What I learned**



* I learned how to use AWS Amplify’s database and interact with the database using GraphQL.
* I learned how to deploy using AWS Amplify.
* I learned how to store and retrieve documents with web3.storage/IPFS.
* I learned how to use Chainlink’s data feeds to get realtime data from blockchain. 
* I learned how to deploy onto Polygon.


## **What's next for Supply Chain Assistant**

I plan to introduce these new features:
- extra payment for redoing the supply process from material sourcing
- multiple suppliers
- multiple shipping lines
- airways / roadways (would have same system as shipping line)
- include insurance for transport authority's equipment and supplier's goods
- payments based on FOB(free on board) / CIF(cost insurance freight), CNF (cost and freight)
