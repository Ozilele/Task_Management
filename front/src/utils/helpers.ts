import { Estimation, Specialization } from "../types/project-types";

export const backend_url = "http://localhost:4444";

export const API_URL = "https://task-manager-api-401408.lm.r.appspot.com"
export const standard_headers = {
  headers: {
      'Content-Type': 'application/json',
      'user-id': "u_rdokvuomzxlexevwbcfr",
      'secret-key': "zzkukrviybwqreleibsduakorgqqgmeiwdgackmuitinkysygvpedhryywjfqltlksuuiklhqznmnayxvxnhnpmvsfanahzgajsncpoblkqbhdyldntawlnzbvmhqczp"
  }
}

export const fibNumbers = [
  Estimation.ONE,
  Estimation.TWO,
  Estimation.THREE,
  Estimation.FIVE,
  Estimation.EIGHT,
  Estimation.THIRTEEN,
  Estimation.TWENTY_ONE
];

export const specializations = [
  Specialization.FRONTEND,
  Specialization.BACKEND,
  Specialization.DEVOPS,
  Specialization.UX_UI
]