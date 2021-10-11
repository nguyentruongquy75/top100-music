fetch(
  "https://api.apify.com/v2/key-value-stores/EJ3Ppyr2t73Ifit64/records/LATEST"
).then((response) => {
  response.json().then((value) => {
    console.log(value);
  });
});
