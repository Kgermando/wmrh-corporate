declare let process: any;
const env = process.env.NODE_ENV;

export const environment = {  
  apiURL: (env  === 'production') 
    ? 'https://wm-rh-api-782e302a0219.herokuapp.com/api'
    : 'http://localhost:3000/api',

  publicKey: "BHnrukMOoUpozT0O0LK9g_snE-nSCM_XeoEfbsy3FJO5vJQIAk5TeSYqol0HlvMUU-3poVLx1xNl8nAv14JVoL4",
  privateKey: "EowHD96TortofOIEv_Idh2vidxh52GNSpnE-PYipqD0"
};