import React from "react";
import WorkerAnalysisPage from "@/Components/TicketDash/WorkerAnalysisPage";

const worker = () => {
    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-12">
                    <WorkerAnalysisPage />
                </div>
            </div>
        </div>
    );
};

export default worker;
