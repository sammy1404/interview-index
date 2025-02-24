"use client"

import { useParams } from "next/navigation";
import Rounds from "./Rounds";

const RoundsPage = () => {
  const { company } = useParams(); // Get company name from the URL

  return (
    <div>
      <h1>Rounds for {company}</h1>
      <Rounds company={company} />
    </div>
  );
};

export default RoundsPage;
