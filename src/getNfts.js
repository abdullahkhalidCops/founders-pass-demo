const Moralis = require('moralis').default;;
const { FoundersPassAbi, USDTAbi, ERC20Abi } = require('./abi/FounderPassAbi');

async function listener() {
    try {
        await Moralis.start({
          apiKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6ImE3ZTI4ZDAwLTZjYmYtNDBlMy1hNjRlLWViMDNiMTU3NjJhNyIsIm9yZ0lkIjoiMzY5NjU5IiwidXNlcklkIjoiMzc5OTEyIiwidHlwZUlkIjoiYmNiMjY0NDMtOGE5ZC00NWFhLTlhNTMtZTYzOGNhMTU4NWEwIiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE3MDM1ODQ4MzUsImV4cCI6NDg1OTM0NDgzNX0.S1pa8ZU1R_XjhTh9tvswFLL0MKVUsj9XdpyUwS-d0kU"
        });
      
        const response = await Moralis.EvmApi.nft.getWalletNFTs({
          "chain": "0x61",
          "format": "decimal",
          "mediaItems": false,
          "address": "0xA33d159Be1Bb7f094Baa2cfb4a5f6f9ac72D77CE"
        });
      
        console.log(response.raw);
      } catch (e) {
        console.error(e);
      }
}

listener()