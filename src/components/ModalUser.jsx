import { useEffect, useState, useMemo } from "react";

export default function ModalUser({
  isOpen,
  onClose,
  userData,
  userName,
  openModalUser,
}) {
  const ArrayUserData = Object.values(userData);

  // Memoize the filtered data to improve performance
  const filteredLetters = useMemo(() => {
    return ArrayUserData.filter((letter) => letter.receiver_name === userName);
  }, [ArrayUserData, userName]);

  if (!isOpen) return null;
  return (
    <>
    <div className="text-black fixed flex inset-0 bg-black/50 justify-center items-center backdrop-blur-md z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
          <div className="flex justify-between items-center border-b pb-3">
            <h1 className="text-2xl font-bold text-gray-800">
              จดหมายนาย {userName}
            </h1>
            <button
              className="btn btn-sm btn-circle btn-outline"
              onClick={() => {
                onClose();
                openModalUser(userData);
              }}
            >
              ✕
            </button>
          </div>

          {/* แสดงจดหมาย */}
          <div className="space-y-4 max-h-96 overflow-y-auto mt-4">
            {filteredLetters.length > 0 ? (
              filteredLetters.map((letter, index) => (
                <div
                  key={index}
                  className="card bg-base-100 shadow-md border border-gray-200 rounded-lg"
                >
                  <div className="card-body">
                    <h2 className="font-bold text-lg card-title">
                      จดหมายที่ {index + 1} ✉️📦
                    </h2>
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">ผู้รับ:</span>{" "}
                      {letter.receiver_name}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">ผู้ส่ง:</span>{" "}
                      {letter.sender_name}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">วันที่รับ:</span>{" "}
                      {letter.received_date
                        ? new Date(letter.received_date).toLocaleDateString()
                        : "ไม่มีข้อมูล"}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center">
                ไม่มีจดหมายในขณะนี้
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
