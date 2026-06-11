import React from "react";
import WorkAnalysis from "@/Components/TicketDash/WorkAnalysisForm";

const work = () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-12">
                    <WorkAnalysis workerId={user._id} />
                </div>
            </div>
        </div>
    );
};

export default work;
