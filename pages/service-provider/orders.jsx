import {
  Button,
  DataTable,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
  TableToolbar,
  TableToolbarContent,
} from "carbon-components-react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const headers = [
  {
    key: "orderId",
    header: "OrderId",
  },
  {
    key: "foodName",
    header: "Dish Name",
  },
  {
    key: "status",
    header: <div style={{ textAlign: "center" }}>Status</div>,
  },
];

function orders() {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [flag, setFlag] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleCompleted = async (dish, index) => {
    // setData(newData);
    setFlag(index);
    console.log(dish);

    try {
      const response = await fetch("http://127.0.0.1:5000/status_change", {
        method: "POST", // You can use other HTTP methods like GET, PUT, DELETE, etc.
        headers: {
          "Content-Type": "application/json", // Specify the content type if you're sending JSON data
          // Additional headers can be added here
        },
        body: JSON.stringify({
          userid: dish.userid,
          order_id: dish.orderid,
          food_name: dish.food_name,
        }),
      });

      if (!response.ok) {
        throw new Error("Network request failed");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const fetchData = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/list_order_fsp");

      if (!response.ok) {
        throw new Error("Network request failed");
      }
      setLoading(false);
      const result = await response.json();

      console.log(result);
      const displayOrders = result.map((item, index) => ({
        id: index + 1,
        orderId: item.orderid,
        foodName: item.food_name,
        status: (
          <div style={{ padding: "1rem", textAlign: "center" }}>
            {" "}
            <Button
              style={{ backgroundColor: "#0f62fe" }}
              onClick={() => handleCompleted(item, index + 1)}
            >
              Click to Complete Order
            </Button>{" "}
          </div>
        ),
      }));
      console.log(displayOrders);
      setData(displayOrders);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (flag) {
      const newData = data.filter((item) => item.id !== flag);
      setData(newData);
      setFlag(null);
    }
  }, [flag]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        width: "60%",
        margin: "auto",
        padding: "100px",
      }}
    >
      {data.length > 0 ? (
        <DataTable
          rows={data}
          headers={headers}
          render={({
            rows,
            headers,
            getHeaderProps,
            getExpandHeaderProps,
            getRowProps,
            getExpandedRowProps,
            getToolbarProps,
            getTableProps,
            getTableContainerProps,
          }) => (
            <TableContainer
              description=""
              {...getTableContainerProps()}
              style={{ marginTop: "20px" }}
            >
              <TableToolbar {...getToolbarProps()}>
                <TableToolbarContent>
                  <Button
                    onClick={() => {
                      router.push("/service-provider/add-order");
                    }}
                    kind="primary"
                  >
                    + Add new Order
                  </Button>
                </TableToolbarContent>
              </TableToolbar>
              <Table {...getTableProps()}>
                <TableHead>
                  <TableRow>
                    {headers.map((header) => (
                      <TableHeader {...getHeaderProps({ header })}>
                        {header.header}
                      </TableHeader>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows?.map((row) => (
                    <TableRow {...getRowProps({ row })}>
                      {row?.cells?.map((cell) => (
                        <TableCell key={cell.id}>{cell.value}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        />
      ) : (
        <>
          {!loading && (
            <Button
              onClick={() => {
                router.push("/service-provider/add-order");
              }}
              kind="primary"
            >
              + Add new Order
            </Button>
          )}
        </>
      )}
    </div>
  );
}

export default orders;
