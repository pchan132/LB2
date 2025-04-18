import { useEffect, useMemo, useState } from "react";
export default function ModalLetter({
  onOpenTable,
  onClose,
  userData,
  OpenModalUser,
}) {
  if (!userData || userData.length === 0) return null;

  const [searchTerm, setSearchTerm] = useState(""); // state สำหรับเก็บค่าค้นหา
  const arrayUserData = Object.values(userData);

  // Combine the creation of receiverName and countMap into a single loop
  const { receiverName, countMap } = arrayUserData.reduce(
    (acc, user) => {
      if (!acc.receiverNameSet.has(user.receiver_name)) {
        acc.receiverNameSet.add(user.receiver_name);
        acc.receiverName.push(user.receiver_name);
      }
      acc.countMap[user.receiver_name] =
        (acc.countMap[user.receiver_name] || 0) + 1;
      return acc;
    },
    { receiverName: [], receiverNameSet: new Set(), countMap: {} }
  );

  // ฟังก์ชันค้าหาชื่อ
  const filteredReceiverName = useMemo(() => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return receiverName.filter((name) =>
      name.toLowerCase().includes(lowerCaseSearchTerm)
    );
  }, [receiverName, searchTerm]);

  if (!onOpenTable) return null;
  return (
    <>
      <div className="text-black fixed flex inset-0 bg-black/50 justify-center items-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-2xl w-full max-w-2xl">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-primary">
              รายชื่อที่มีจดหมาย {userData[0].departments?.substring(0, 4)}
              {userData[0].departments?.substring(8)}
            </h1>
            <button
              className="btn btn-sm btn-circle btn-error btn-outline"
              onClick={onClose}
            >
              ✕
            </button>
          </div>
          <div className="divider"></div>
          {/* ค้นหาชื่อ */}
          <div className="form-control mb-4 flex justify-center items-center gap-2">
            <input
              type="text"
              placeholder="ค้นหาชื่อ"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input input-bordered w-full max-w-xs"
            />
          </div>
          {/* แสดงรายชื่อ */}
          <div className="overflow-x-auto ">
            <table className="table table-zebra w-full">
              <thead>
                <tr className="bg-primary text-white">
                  <th>ชื่อ-นามสกุล</th>
                  <th className="text-center">จำนวนจดหมาย</th>
                </tr>
              </thead>
              <tbody>
                {filteredReceiverName.map((receiverName, index) => {
                  return (
                    <tr
                      key={receiverName}
                      className="hover:bg-primary/10 cursor-pointer"
                      onClick={() => OpenModalUser(receiverName)}
                    >
                      <td className="text-gray-700">{receiverName}</td>
                      <td className="text-center text-gray-700">
                        <p className="badge badge-neutral badge-outline">
                          {countMap[receiverName]}
                        </p>{" "}
                        ฉบับ
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
