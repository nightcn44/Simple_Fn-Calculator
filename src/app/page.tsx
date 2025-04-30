"use client";

import { useState } from "react";
import axiosInstance from "../app/utils/api";
import axios from "axios";

export default function Home() {
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [result, setResult] = useState<string | number>("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // ฟังก์ชันตรวจสอบค่าตัวเลข
  const isValidNumber = (value: string) =>
    !isNaN(Number(value)) && value.trim() !== "";

  const calculate = async (operation: string) => {
    if (!isValidNumber(a) || !isValidNumber(b)) {
      setErrorMessage("Please enter valid numbers for both values");
      setResult(""); // รีเซ็ตผลลัพธ์
      return;
    }

    try {
      setLoading(true);
      setErrorMessage(""); // รีเซ็ตข้อความผิดพลาด
      const res = await axiosInstance.get(`/${operation}`, {
        params: { a, b },
      });
      setResult(res.data.result);
    } catch (err) {
      const message =
        axios.isAxiosError(err) && err.response?.data?.error
          ? err.response.data.error
          : "Something went wrong";

      setErrorMessage(message);
      setResult("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-500">
      <div className="bg-white p-6 rounded-2xl shadow-xl w-96 space-y-4">
        <h1 className="text-2xl font-bold text-center">Calculator</h1>

        <input
          type="number"
          placeholder="Enter A"
          value={a}
          onChange={(e) => setA(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          type="number"
          placeholder="Enter B"
          value={b}
          onChange={(e) => setB(e.target.value)}
          className="w-full p-2 border rounded"
        />

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => calculate("add")}
            className="bg-green-500 text-white py-2 rounded hover:bg-green-600"
            disabled={loading}
          >
            +
          </button>
          <button
            onClick={() => calculate("subtract")}
            className="bg-yellow-500 text-white py-2 rounded hover:bg-yellow-600"
            disabled={loading}
          >
            -
          </button>
          <button
            onClick={() => calculate("multiply")}
            className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
            disabled={loading}
          >
            ×
          </button>
          <button
            onClick={() => calculate("divide")}
            className="bg-red-500 text-white py-2 rounded hover:bg-red-600"
            disabled={loading}
          >
            ÷
          </button>
        </div>

        {/* แสดงผลลัพธ์หรือข้อความผิดพลาด */}
        <div className="text-center mt-4 text-xl font-medium text-gray-700">
          {loading ? "Calculating..." : `Result: ${result}`}
        </div>

        {/* แสดงข้อความผิดพลาดในกรณีที่เกิดข้อผิดพลาด */}
        {errorMessage && (
          <div className="mt-4 text-red-600 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM9 9a1 1 0 112 0v2a1 1 0 11-2 0V9zm0 4a1 1 0 112 0v2a1 1 0 11-2 0v-2z"
                clipRule="evenodd"
              />
            </svg>
            <span>{errorMessage}</span>
          </div>
        )}
      </div>
    </div>
  );
}
