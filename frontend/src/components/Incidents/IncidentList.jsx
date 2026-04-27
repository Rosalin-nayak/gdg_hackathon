import { useEffect, useState } from "react";
import { getIncidents } from "../../api/incidents";

function IncidentList() {
  const [data, setData] = useState([]);

  useEffect(()=>{
    getIncidents()
    .then(res=>console.log("DATA:",res.data))
    .catch(err=>console.error(err))
  },[]);

  return (
    <div>
      {data.map((item, index) => (
        <div key={index}>{item.title}</div>
      ))}
    </div>
  );
}

export default IncidentList;