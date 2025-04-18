import { useState, useEffect, useMemo, useCallback } from "react";

export default function ModalForm({
  isOpen,
  onClose,
  onSubmit,
  mode,
  userData,
  nameData,
}) {
  const [sarchName, setSarchName] = useState(""); // State สำหรับเก็บค่าชื่อ

  // State สำหรับเก็บค่าฟอร์ม
  const [formData, setFormData] = useState({
    sheetName: "Letters",
    receiver_name: "",
    sender_name: "",
    received_date: "",
    departments: "",
    status: "",
  });

  function getLocalToday() {
    const today = new Date();
    const offset = today.getTimezoneOffset();
    const localDate = new Date(today.getTime() - offset * 60 * 1000);
    return localDate.toISOString().split("T")[0];
  }
  const today = getLocalToday();
  const [date, setDate] = useState(today);

  function toLocalDateString(date) {
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - offset * 60 * 1000);
    return localDate.toISOString().split("T")[0];
  }
  useEffect(() => {
    if (mode === "edit" && userData) {
      setFormData({
        sheetName: "Letters",
        receiver_name: userData?.receiver_name || "",
        sender_name: userData?.sender_name || "",
        received_date: userData.received_date
        ? toLocalDateString(new Date(userData.received_date))
        : "",
        departments: userData?.departments || "",
        status: userData?.status || "NOT", // ถ้าไม่มีค่า ให้ใช้ "NOT"
      });
    } else if (mode === "add") {
      setFormData({
        sheetName: "Letters",
        receiver_name: "",
        sender_name: "",
        received_date: today, // 🟢 ตั้งค่าเริ่มต้นเป็นวันนี้,
        departments: "",
        status: "NOT",
      });
    }
  }, [mode, userData]);

  const handleChange = useCallback((e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault(); // ป้องกันการรีเฟรชหน้า
    // ตรวจสอบว่ามีการกรอกข้อมูลครบถ้วนหรือไม่
    if (!formData.receiver_name) {
      alert("กรุณากรอกชื่อผู้รับ");
      return;
    } else if (!formData.sender_name) {
      alert("กรุณากรอกชื่อผู้ส่ง");
      return;
    } else if (!formData.received_date) {
      alert("กรุณากรอกวันที่รับ");
      return;
    } else if (!formData.departments) {
      alert("กรุณาเลือกแผนก");
      return;
    } else if (!formData.status) {
      alert("กรุณาเลือกสถานะ");
      return;
    }
    try {
      await onSubmit(formData); // ส่งไปให้
      setFormData({
        sheetName: "Letters",
        receiver_name: "",
        sender_name: "",
        received_date: "",
        departments: "",
        status: "NOT", // ค่าเริ่มต้นเป็น "NOT"
      });
      onClose(); // ปิด Modal
    } catch (error) {
      console.log(error);
    }
  };

  const departments = useMemo(
    () => Array.from(new Set(nameData.map((data) => data.departments))),
    [nameData]
  );

  const fileteredName = useMemo(() => {
    const lowerSearch = sarchName.toLowerCase();
    return nameData.filter(
      (name) =>
        name.firstName.toLowerCase().includes(lowerSearch) ||
        name.lastName.toLowerCase().includes(lowerSearch)
    );
  }, [nameData, sarchName]);

  const handleNameChange = useCallback(
    (e) => {
      const selectedName = e.target.value;
      setFormData((prev) => ({ ...prev, receiver_name: selectedName }));

      const foundUser = nameData.find(
        (name) => `${name.firstName} ${name.lastName}` === selectedName
      );

      if (foundUser) {
        setFormData((prevData) => ({
          ...prevData,
          departments: foundUser.departments || "",
        }));
      }
    },
    [nameData]
  );
  if (!isOpen) return null;
  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
        <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">
              {mode === "add" ? "เพิ่มข้อมูล" : "แก้ไขข้อมูล"}
            </h2>
            <button
              className="btn btn-sm btn-circle btn-error btn-outline"
              onClick={onClose}
              aria-label="Close Modal"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-1"
                htmlFor="receiver_name"
              >
                ผู้รับ
              </label>
              <input
                type="text"
                className="input input-bordered w-full"
                placeholder="ชื่อ-นามสกุล"
                id="receiver_name"
                name="receiver_name"
                value={formData.receiver_name}
                onChange={handleNameChange}
                list="Name_receiver"
              />
              <datalist id="Name_receiver">
                {nameData.map((name, index) => (
                  <option
                    key={index}
                    value={`${name.firstName} ${name.lastName}`}
                  >
                    {name.departments}
                  </option>
                ))}
              </datalist>
            </div>

            <div>
              <label
                htmlFor="sender_name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                ผู้ส่ง
              </label>
              <input
                type="text"
                className="input input-bordered w-full"
                placeholder="ชื่อผู้ส่ง, บริษัท"
                id="sender_name"
                name="sender_name"
                value={formData.sender_name}
                onChange={handleChange}
              />
            </div>

            <div>
              <label
                htmlFor="received_date"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                วันที่รับ (ดด/วว/ปปปป)
              </label>
              <input
                type="date"
                className="input input-bordered w-full"
                id="received_date"
                name="received_date"
                value={formData.received_date}
                onChange={handleChange}
              />
            </div>

            <div>
              <label
                htmlFor="department_id"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                แผนก
              </label>
              <select
                id="department_id"
                name="department_id"
                value={formData.departments}
                onChange={handleChange}
                className="select select-bordered w-full"
              >
                <option disabled={true} value="">
                  เลือกแผนก
                </option>
                {departments.map((item, index) => (
                  <option key={index} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="status"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                สถานะ
              </label>
              <select
                className="select select-bordered w-full"
                name="status"
                id="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="NOT" className="text-red-500">
                  ยังไม่รับ
                </option>
                <option value="RECEIVED" className="text-green-500">
                  รับแล้ว
                </option>
              </select>
            </div>

            <button
              className={`btn w-full text-white ${
                mode === "add"
                  ? "bg-green-500 hover:bg-green-600"
                  : "bg-yellow-500 hover:bg-yellow-600"
              }`}
              type="submit"
            >
              {mode === "add" ? "เพิ่มข้อมูล" : "แก้ไขข้อมูล"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
