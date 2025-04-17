import React, { useState, useMemo } from "react";

export default function TableName({ tableDataName, onEdit, onDelete }) {
  const [searchTerm, setSearchTerm] = useState(""); // คำที่ใช้ค้นหา
  const [selectedDepartment, setSelectedDepartment] = useState(""); // แผนกที่เลือก

  // Memoize unique departments
  const departments = useMemo(
    () => [...new Set(tableDataName.map((data) => data.departments))],
    [tableDataName]
  );

  // Memoize filtered data
  const filteredData = useMemo(() => {
    return tableDataName.filter((data) => {
      const departmentMatch =
        selectedDepartment === "" || data.departments === selectedDepartment;
      const nameMatch =
        data.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        data.lastName.toLowerCase().includes(searchTerm.toLowerCase());
      return departmentMatch && nameMatch;
    });
  }, [tableDataName, searchTerm, selectedDepartment]);

  const handleReset = () => {
    setSearchTerm("");
    setSelectedDepartment("");
  };

  const handleDelete = (id) => {
    onDelete(id);
  };

  const handleEdit = (mode, data) => {
    onEdit(mode, data);
  };

  return (
    <div className="flex flex-col items-center p-4">
      {/* ช่องค้นหา */}
      <div className="mb-4 flex flex-col md:flex-row gap-4 w-full max-w-3xl">
        <input
          type="text"
          placeholder="ค้นหาชื่อ-นามสกุล"
          className="input input-bordered w-full md:w-auto"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* เลือกแผนก */}
        <select
          className="select select-bordered w-full md:w-auto"
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(e.target.value)}
        >
          <option value="">เลือกแผนก</option>
          {departments.map((dept, index) => (
            <option key={index} value={dept}>
              {dept}
            </option>
          ))}
        </select>
        <button className="btn btn-secondary" onClick={handleReset}>
          รีเซ็ตการค้นหา
        </button>
      </div>

      {/* แสดงข้อมูล */}
      <div className="overflow-x-auto w-full">
        <table className="table w-full">
          <thead>
            <tr>
              <th className="text-center  text-black border">ลำดับ</th>
              <th className="text-center  text-black border">ชื่อ</th>
              <th className="text-center  text-black border">นามสกุล</th>
              <th className="text-center  text-black border">แผนก</th>
              <th className="text-center  text-black border">จัดการ</th>
            </tr>
          </thead>
          <tbody >
            {filteredData.map((data, index) => (
              <tr key={data.idName} className="text-center">
                <td className="text-center  text-black border">{index + 1}</td>
                <td className="text-center  text-black border">{data.firstName}</td>
                <td className="text-center  text-black border">{data.lastName}</td>
                <td className="text-center  text-black border">{data.departments}</td>
                <td className="text-center  text-black border">
                  <button
                    className="btn btn-error btn-sm mx-1"
                    onClick={() => handleDelete(data.idName)}
                  >
                    ลบ
                  </button>
                  <button
                    className="btn btn-primary btn-sm mx-1"
                    onClick={() => handleEdit("edit", data)}
                  >
                    แก้ไข
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
