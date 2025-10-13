import React from 'react'

function CreateToken() {
  return (
    <div>CreateToken</div>
  )
}

export default CreateToken

// const url = 'https://api.coingecko.com/api/v3/coins/{id}/market_chart';
// const options = {method: 'GET', headers: {'x-cg-demo-api-key': ''}, body: undefined};

// try {
//   const response = await fetch(url, options);
//   const data = await response.json();
//   console.log(data);
// } catch (error) {
//   console.error(error);
// }