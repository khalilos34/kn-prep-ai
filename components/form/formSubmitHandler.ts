import { useState } from "react";
type submitCallback = (data: Record<string, string>) => Promise<void>;
export const useGenericSubmitHandler = (callbacks: submitCallback) => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const data: Record<string, string> = {};
    formData.forEach((value, key) => {
      data[key] = value?.toString();
    });
    try {
      await callbacks(data);
    } catch (error) {
      console.log(error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };
  return { handleSubmit, loading };
};
