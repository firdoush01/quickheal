import axios from "axios";

class APICalls {
  #server_url = process.env.REACT_APP_SERVER_URL;

  async loginDoctor(email, password) {
    const response = await axios.post(
      `${this.#server_url}/api/v1/auth/doctor/login`,
      {
        email,
        password,
      }
    );

    return response;
  }
  async registerDoctor(name, email, password, specialization) {
    const response = await axios.post(
      `${this.#server_url}/api/v1/auth/doctor/register`,
      {
        name,
        email,
        password,
        specialization,
      }
    );

    return response;
  }
  async loginPatient(email, password) {
    const response = await axios.post(
      `${this.#server_url}/api/v1/auth/patient/login`,
      {
        email,
        password,
      }
    );

    return response;
  }
  async registerPatient(name, email, password, age) {
    const response = await axios.post(
      `${this.#server_url}/api/v1/auth/patient/register`,
      { name, email, password, age }
    );

    return response;
  }
}

const apiCalls = new APICalls();

export default apiCalls;
