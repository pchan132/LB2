import { useState, useEffect, useMemo, useCallback, use } from "react";
import axios from "axios";
import { isEqual } from "lodash";
import { Link } from "react-router-dom";

import TableLetters from "../components/TableLetters";
import ModalForm from "../components/ModalForm";

export default function ManageMaills() {
  const [isOpen, setIsOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [tableData, setTableData] = useState([]); //ข้อมูลทั้งหมด
  const [userData, setUserData] = useState({}); // ข้อมูลตอแก้ไข
  const [nameData, setNameData] = useState([]);
  // ฟังก์ชันเปิด Modal
  const openModal = useCallback((mode, data) => {
    setUserData(data);
    setModalMode(mode); // กำหนดโหมดของ Modal ('add' หรือ 'edit')
    setIsOpen(true); // เปิด Modal
  }, []);

  // ฟังก์ชันปิด Modal
  const closeModal = useCallback(() => {
    setIsOpen(false); // ปิด Modal
  }, []);

  // ฟังก์ชันดึงข้อมูลจาก Database
  const fetchData = useCallback(async () => {
    try {
      const [response, responseName] = await Promise.all([
        axios.get(
          "https://gas-proxy-rrwt.onrender.com/api/letters"
        ),
        axios.get(
          "https://gas-proxy-rrwt.onrender.com/api/Name"
        ),
      ]);

      // ใช้ isEqual() เช็คก่อนอัปเดต state
      setTableData((prevData) =>
        !isEqual(prevData, response.data) ? response.data : prevData
      );

      setNameData((prevData) =>
        !isEqual(prevData, responseName.data) ? responseName.data : prevData
      );

      console.log("✅ get Data success");
    } catch (err) {
      console.error("❌ Error fetch data:", err);
    }
  }, []); // Removed unnecessary dependencies

  // ดึงข้อมูลเมื่อ Component โหลดครั้งแรก
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ฟังก์ชันบันทึกข้อมูล
  const submit = async (newData) => {
    if (modalMode === "add") {
      try {
        const response = await axios.post(
          "https://gas-proxy-rrwt.onrender.com/api/letters",
          newData
        );
        console.log("add", response.data);
        fetchData(); // 🔄 โหลดข้อมูลใหม่
        console.log(newData.received_date);
      } catch (err) {
        console.error("Error Add data:", err);
      }
    } else if (modalMode === "edit") {
      try {
        const response = await axios.post(
          `https://gas-proxy-rrwt.onrender.com/api/letters/update`,
          {
            ...newData,
            letter_id: userData.letter_id,
          }
        );
        console.log("edit success");
        fetchData(); // 🔄 โหลดข้อมูลใหม่
        console.log(newData.received_date);
      } catch (err) {
        console.error("Error Edit data:", err);
      }
    }
  };

  // ลบข้อมูล
  const deleteData = async (id) => {
    try {
      const response = await axios.post(`https://gas-proxy-rrwt.onrender.com/api/letters/delete`,{
        sheetName: "Letters",
        letter_id: id
      });
      console.log("✅ delete success");
      fetchData(); // 🔄 โหลดข้อมูลใหม่
    } catch (err) {
      console.error("Error Delete data:", err);
    }
  };
  return (
    <>
      {/* ส่วนหัว */}
      <div className="min-h-screen bg-base-200 p-6 flex flex-col items-center">
        <div className="w-full max-w-7xl bg-white shadow-lg rounded-lg p-6">
          <div className="flex flex-col lg:flex-row justify-between items-center mb-6 gap-4">
            <h1 className="text-3xl font-semibold text-primary">รายการ</h1>
            {/* เพิ่มชื่อคน */}
            <div className="flex flex-wrap gap-2">
              <Link className="btn btn-outline btn-primary" to="/manage-name">
                เพิ่มชื่อ
              </Link>
              {/* เพิ่มจดหมาย */}
              <button
                className="btn btn-primary"
                onClick={() => openModal("add")}
              >
                เพิ่มจดหมาย
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <TableLetters
              dataTable={tableData}
              onEdit={openModal}
              dataDelete={deleteData}
              dataUser={nameData}
            />
          </div>
          <ModalForm
            isOpen={isOpen}
            onClose={closeModal}
            onSubmit={submit}
            mode={modalMode}
            userData={userData}
            nameData={nameData}
          />
        </div>
      </div>
    </>
  );
}
