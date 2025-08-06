import axios from "axios";
import { useEffect, useState } from "react";
import { Table, Button, Space } from "antd";

export const ListAccounts = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);

  const getAllKeys = (rows) => {
    let keys = [];
    rows.forEach((row) => {
      keys.push(row.key || row.id);
      if (row.children && row.children.length > 0) {
        keys = keys.concat(getAllKeys(row.children));
      }
    });
    return keys;
  };

  const handleExpandAll = () => {
    setExpandedRowKeys(getAllKeys(tableData));
  };

  const handleCollapseAll = () => {
    setExpandedRowKeys([]);
  };

  const columns = [
    {
      title: "Hesap Kodu",
      dataIndex: "hesap_kodu",
      key: "hesap_kodu",
      width: 200,
    },
    {
      title: "Hesap Adı",
      dataIndex: "hesap_adi",
      key: "hesap_adi",
      width: 300,
    },
    {
      title: "Borç",
      dataIndex: "borc",
      key: "borc",
      align: "right",
      width: 150,
      render: (value) =>
        new Intl.NumberFormat("tr-TR", {
          style: "currency",
          currency: "TRY",
        }).format(value || 0),
    },
    {
      title: "Alacak",
      dataIndex: "alacak",
      key: "alacak",
      align: "right",
      width: 150,
      render: (value) =>
        new Intl.NumberFormat("tr-TR", {
          style: "currency",
          currency: "TRY",
        }).format(value || 0),
    },
  ];

  const fetchData = async () => {
    try {
      setLoading(true);
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await axios.get(`${apiUrl}/accounts/hierarchical`);
      setData(response.data);
    } catch (error) {
      console.error("Veri çekme hatası:", error);
      setData([]); // Hata durumunda boş array set et
    } finally {
      setLoading(false);
    }
  };

  const tableData = Array.isArray(data) ? data : [];

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div style={{ marginTop: 48, maxWidth: "100%", overflowX: "auto" }}>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginBottom: 16 }}>
        <Space>
          <Button onClick={handleExpandAll}>Tümünü Aç</Button>
          <Button onClick={handleCollapseAll}>Tümünü Kapat</Button>
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={tableData}
        loading={loading}
        pagination={false}
        expandable={{
          expandedRowKeys,
          onExpandedRowsChange: setExpandedRowKeys,
          indentSize: 20,
          rowExpandable: (record) => record.children && record.children.length > 0,
        }}
        scroll={{ y: 500 }}
        size="small"
      />
    </div>
  );
};
