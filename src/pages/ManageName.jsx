import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import TableName from "../components/TableName";
import ModalName from "../components/ModalName";

export default function ManageName() {
  const [dataNameForm, setDataNameForm] = useState([]); // เก็บข้อมูลที่มาจากฟอร์ม
  const [isOpen, setIsOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [userData, setUserData] = useState([]); // แก้ข้อมูลของคน
  //เปิดโมเดล รับ ค่า mode กับ ข้อมูล(data) มา
  const openModal = (mode, data) => {
    setIsOpen(true);
    setModalMode(mode);
    setDataNameForm(data);
  };
  const closeModal = () => {
    setIsOpen(false);
  };

  // ดึงข้อมูล
  const fetchDataName = useCallback(async () => {
    try {
      const response = await axios.get(
        "https://gas-proxy-rrwt.onrender.com/api/Name"
      );
      setUserData(response.data);
      console.log("✅ get Data success");
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, []);

  useEffect(() => {
    fetchDataName();
  }, [fetchDataName]);

  // submit
  const submit = async (newData) => {
    try {
      if (modalMode === "add") {
        await axios.post(
          "https://gas-proxy-rrwt.onrender.com/api/letters",
          newData
        );
        console.log("✅ add Data success");
      } else if (modalMode === "edit") {
        await axios.post(
          `https://gas-proxy-rrwt.onrender.com/api/letters/update`,
          {
            ...newData,
            letter_id: dataNameForm.idName,
          }
        );
        console.log(newData);
        console.log("✅ update Data success");
      }
      fetchDataName();
    } catch (err) {
      console.error("Error submitting data:", err);
    }
  };

  const deleteData = async (id) => {
    try {
      await axios.post(
        `https://gas-proxy-rrwt.onrender.com/api/letters/delete`,
        {
          sheetName: "Name",
          letter_id: id,
        }
      );
      setUserData((prevData) => prevData.filter((item) => item.idName !== id));
      console.log("✅ delete Data success");
    } catch (err) {
      console.error("Error deleting data:", err);
    }
  };

  // แผนกที่ใส่ไป
  const departments = Array.from(
    new Set(userData.map((dept) => dept.departments))
  );
  return (
    <>
      <div className="min-h-screen bg-base-200 p-6 flex flex-col items-center">
        <div className="w-full max-w-7xl bg-white shadow-lg rounded-lg p-6">
          <div className="flex justify-between items-center mb-6 mt-10 px-5">
            <h1 className="text-3xl font-bold text-gray-800">รายชื่อ</h1>
            <button
              className="btn btn-primary shadow-lg hover:shadow-xl transition-all"
              onClick={() => openModal("add")}
            >
              เพิ่มข้อมูล
            </button>
          </div>
          <div className="flex justify-center items-center px-5">
            <div className="w-full max-w-5xl">
              <TableName
                tableDataName={userData}
                onEdit={openModal}
                onDelete={deleteData}
              />
            </div>
          </div>
          <ModalName
            openModal={isOpen}
            closeModal={closeModal}
            dataName={dataNameForm}
            departments={departments}
            mode={modalMode}
            onSubmit={submit}
          />
        </div>
      </div>
    </>
  );
}
