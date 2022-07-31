# TEIA Download Standard

This HTML5/CSS/JS framework includes download logic used within [EditTrax](https://teia.art/objkt/612561) Interactive Music NFTs. Built to existing TEIA.art platform standards it provides a token gated experience that can be minted/unlocked within the following marketplace/enviroments:
<br>

<img src="https://gateway.pinata.cloud/ipfs/QmWyDbiLAujvszhfkriiQ8pf7Tif3oShAEZDWVUrzRkvSn"/>
<br><br>

## Live Preview:<br><br>

# Create Your Own 

### NO CODE 
<br>
1) Download this repo as a .zip file<br>
2) Open and replace the existing .wav file "track.wav" with your own file labeled "track.wav"<br>
3) Compress the folder and upload it as a .zip file when creating Interactive NFTs on platforms:<br><br>

[Teia.art](https://teia.art/)<br>
[Objkt.com](https://objkt.com/)<br>
[Hic.af](https://hic.af/)<br>
[Versum.xyz](https://objkt.com/)<br>
<br>


### LOW CODE 
<br>
1) All content can be customized by updating images in the folder (retain naming conventions)<br>
2) Further customization is possible when editing the values in base.css via a code editor<br>
3) Create unique names for downloadable .wavs updating track.js<br>
<br>

### CODE CUSTOMIZATIONS
<br>

Experiment, collaborate with or hire a front end dev to realize the full potential of this framework. Use it as a starting point leveraging its download mechanism and audio framework (tone.js). Collaborate with creative coders, visual artists and music producers to create a collectible experience for your next track release.


<br>
*To preview visual changes you can double-click on index.html directly from the folder<br>
**To preview audio requires opening a live server from within a text editor like Visual Studio Code<br>
***You can alternatively hear the audio when previewing this as an NFT, at the time of mint
<br><br>

### DISCLAIMER
<br>

Bai-ee is not responsible for how this repo is used by the public and urges everyone to have good wallet hygiene when collecting interactive NFTS! DO NOT consider the content placed within this nft secured and inaccessible. It can be downloaded regardless of ownership when viewing the network tab in developer tools. The trick is to integrate the download feature into a more robust tone.js experience. EXAMPLE: The [Alpha Test EditTrax player](https://objkt.com/asset/hicetnunc/612561) renders loops into a track at the time of download, eliminating aforementioned issue.
<br><br>

# Tech Stack

[HTML5/CSS/JS](https://www.w3.org/wiki/The_web_standards_model_-_HTML_CSS_and_JavaScript)<br>
[Tone.js](https://tonejs.github.io/)<br>
[Greensock.js](https://greensock.com/)<br>
[Tzkt.api](https://tzkt.io/)<br>

<br>
Build Resources:<br><br>

[TEIA.art (Interactive OBJKT) GitHub](https://github.com/teia-community/teia-docs/wiki/Interactive-OBJKTs)<br>
[Beyond NFT GitHub](https://github.com/BeyondNFT/sandbox)<br>
<br>
<br>

# More Information

Whats [EditTrax](https://EditTrax.wiki)<br>
Contact [EditTrax](https://calendly.com/bai-ee/30min?month=2022-06)<br>
<br><br>

# Support

This repository contains examples that you can use to create Zip Archive for NFTs without that you can then upload on Minterverse.io

Installation
Clone this git repository

git clone git@github.com:orbix360/nft-examples.git

Or download it directly from github's interface

Examples
Basic HTML with ownership validation

Reading the URL Parameters
Some of the NFT examples demonstrate to add code to an NFT to enable verification of the ownership of the NFT.

Adding ownership verification to your Interactive NFT enables such use cases as:

Show/hide content within the NFT
Unlock additional functionality within the interactive NFT
In order to enable NFT ownership verification, the Minterverse.io NFT viewer passes the following URL parameters to the NFT:

viewer - the wallet address of who is viewing the NFT
contract - the address of the NFT contract that was used to mint the NFT
objkt - the NFT token id
As shown in the examples, these parameters can then be read by adding simple Javascript code to your NFT:

const urlParams = new URLSearchParams(window.location.search);
if (urlParams) {
    const viewer = urlParams.get('viewer');
    const contract = urlParams.get('contract');
    const objkt = urlParams.get('objkt');
    const owner = await getTokenOwner(viewer, contract, objkt);
    const isOwner = viewer && owner && viewer === owner;
    if (isOwner) {
        // show content
    }
}
Querying the Tzkt API
The above example uses a function getTokenOwner to get the owner of the NFT:

async function getTokenOwner(viewer, contract, objkt){
  return new Promise((resolve, reject) => {
    const url = `https://api.tzkt.io/v1/contracts/${contract}/bigmaps/assets.ledger/keys?key.eq=${objkt}&limit=1&select=value`
    if (contract && objkt && viewer) {
      fetch(url)
        .then(response => response.text())
        .then(resultText => {
          const resultList = JSON.parse(resultText);
          if (resultList && resultList.length > 0) {
            const result = resultList[0];
            resolve(result);
          } else {
            resolve(null);
          }
        });
    } else {
      resolve(null);
    }
  });
}

[BAI-EE](https://tell.ie/bai_ee) @ [bai-ee.tez](https://EditTrax.com)
