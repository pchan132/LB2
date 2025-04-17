import { useState, useEffect, useMemo, useCallback } from "react";

export default function ModalName({
  openModal,
  closeModal,
  dataName,
  departments,
  mode,
  onSubmit,
}) {
  const [info, setInfo] = useState({
    sheetName: "Name",
    firstName: "",
    lastName: "",
    departments: "",
  });

  // Debounced handleChange function
  const handleChange = useCallback(
    (e) => {
      setInfo((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
      }));
    },
    [setInfo]
  );

  // submit ให้ข้อมูลเข้าไปที่ info
  const handleSubmit = async (e) => {
    e.preventDefault(); // ป้องกันการรีเฟรชหน้าเว็บ
    // ตรวจสอบข้อมูลก่อนส่ง
    if (!info.firstName) {
      alert("กรุณากรอกชื่อ");
      return;
    } else if (!info.lastName) {
      alert("กรุณากรอกนามสกุล");
      return;
    } else if (!info.departments) {
      alert("กรุณากรอกแผนก");
      return;
    }
    try {
      await onSubmit(info);
      setInfo({
        sheetName: "Name",
        firstName: "",
        lastName: "",
        departments: "",
      });
      closeModal();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (mode === "edit") {
      setInfo({
        sheetName: "Name",
        firstName: dataName.firstName || "",
        lastName: dataName.lastName || "",
        departments: dataName.departments || "",
      });
    } else if (mode === "add") {
      setInfo({
        sheetName: "Name",
        firstName: "",
        lastName: "",
        departments: "",
      });
    }
  }, [mode, dataName]);

  // Memoize departments rendering
  const departmentOptions = useMemo(
    () =>
      departments.map((name, index) => (
        <option key={index} value={name}>
          {name}
        </option>
      )),
    [departments]
  );

  if (!openModal) return null;
  return (
    <>
      <div className="flex fixed inset-0 items-center justify-center bg-black/50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">
              {mode === "add" ? "เพิ่มข้อมูล" : "แก้ไขข้อมูล"}
            </h2>
            <button
              className="btn btn-sm btn-circle btn-outline btn-error"
              type="button"
              onClick={closeModal}
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-gray-700"
              >
                ชื่อ
              </label>
              <input
                type="text"
                value={info.firstName}
                id="firstName"
                name="firstName"
                className="input input-bordered w-full mt-1"
                onChange={handleChange}
              />
            </div>
            <div>
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-gray-700"
              >
                นามสกุล
              </label>
              <input
                type="text"
                name="lastName"
                id="lastName"
                value={info.lastName}
                className="input input-bordered w-full mt-1"
                onChange={handleChange}
              />
            </div>
            <div>
              <label
                htmlFor="department"
                className="block text-sm font-medium text-gray-700"
              >
                แผนก
              </label>
              <input
                type="text"
                value={info.departments}
                name="departments"
                id="departments"
                className="input input-bordered w-full m-1"
                onChange={handleChange}
                list="departments1"
              />
              <datalist id="departments1">{departmentOptions}</datalist>
            </div>
            <div>
              <input
                type="submit"
                className={`btn w-full ${
                  mode === "add" ? "btn-success" : "btn-warning"
                }`}
                value={mode === "add" ? "เพิ่มข้อมูล" : "แก้ไขข้อมูล"}
              />
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
