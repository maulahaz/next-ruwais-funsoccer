import { supabase } from "./supabase";
import crypto from "crypto";

// export const handleLoginAdmin = async (email, password, router, setError) => {
export const handleLogin = async (email, password, setError) => {
  try {
    let loggedInData = null;
    const { data, error } = await supabase
      .from("players")
      .select("email, passkey, name, alias, auth_level")
      .eq("email", email)
      .single();

    if (error) throw error;

    console.log("Data from DB: ", data);

    const hashedPassword = crypto
      .createHash("md5")
      .update(password)
      .digest("hex");

    console.log("Hashed Pwd: ", hashedPassword);

    if (data && data.passkey === hashedPassword) {
      const storedData = {
        name: data.name,
        alias: data.alias,
        email: data.email,
        auth_level: data.auth_level,
      };
      loggedInData = localStorage.setItem(
        "loggedInData",
        JSON.stringify(storedData)
      );
      console.log("Aut log: ", storedData);
      return storedData;
    } else {
      setError("Invalid email or password");
      return null;
    }
  } catch (error) {
    setError("Unrecognized user!!");
    console.error("Error:", error);
    return null;
  }
};
