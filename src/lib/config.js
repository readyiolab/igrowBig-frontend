// src/lib/config.js
const API_BASE_URL = window.location.origin.includes("localhost")
  ? "https://igrowbig.com/api"
  : `${window.location.origin}/api`;

export default {
  API_BASE_URL,
};


// src/lib/config.js
// const origin = window.location.origin;

// const API_BASE_URL =
//   origin.includes("localhost:3000") || origin.includes("localhost:3001")
//     ? "https://igrowbig.com/api"
//     : `${origin}/api`;

// export default {
//   API_BASE_URL,
// };
