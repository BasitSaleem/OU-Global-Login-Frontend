export interface signinData {
  email: string;
  password: string;
  rememberMe: string;
  client_id?: string;
  redirect_uri?: string;
  scope?: string;
  state?: string;
  nonce?: string;
  code_challenge?: string;
  response_type?: string;
  code_challenge_method?: string;
}
export interface signUpData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}
