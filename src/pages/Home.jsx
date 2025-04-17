import { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import isEqual from 'lodash.isequal'
import Department from "../components/Department";
import ModalUser from "../components/ModalUser";
import ModalLetter from "../components/ModalLetter";
export default function Home() {
  const [data, setData] = useState({});
  const [onOpen, setOnOpen] = useState(false);
  const [openModalUser, setOpenModalUser] = useState(false);
  const [userData, setUserData] = useState({});
  const [userName, setUserName] = useState([]);
  console.log(openModalUser);
  console.log(onOpen);
  // เปิดรายละเอียดข้อมูล
  const openModal = useCallback((user) => {
    setOnOpen(true);
    setUserData(user);
  }, []);

  // เปิด ModalUser
  const isModalUser = useCallback((user) => {
    setOpenModalUser(true);
    setOnOpen(false);
    setUserName(user);
  }, []);

  // ปิดรายละเอียดข้อมูล
  const closeModal = useCallback(() => {
    setOnOpen(false);
    setOpenModalUser(false);
  }, []);

  // Optimize fetchData with useCallback
  const fetchData = useCallback(async () => {
    try {
      const response = await axios.get(`https://gas-proxy-rrwt.onrender.com/api/letters`);
      // ใช้ isEqual() เช็คก่อนอัปเดต state
      setData((prevData) =>
        !isEqual(prevData, response.data) ? response.data : prevData
      );
      console.log("✅ get Data success");
    } catch (err) {
      console.error("❌ Error fetch data:", err);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <>
     <Department userData={data} onOpen={openModal} />
      <ModalLetter
        onOpenTable={onOpen}
        onClose={closeModal}
        userData={userData}
        OpenModalUser={isModalUser}
      />
     <ModalUser
        isOpen={openModalUser}
        userData={userData}
        onClose={closeModal}
        userName={userName}
        openModalUser={openModal}
      />
    </>
  )
}
