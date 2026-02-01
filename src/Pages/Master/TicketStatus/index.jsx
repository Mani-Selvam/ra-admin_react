import React from "react";
import TicketStatusMaster from "@/Components/MasterDash/TicketStatusMaster";

const TicketStatus = () => {
    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-12">
                    <TicketStatusMaster />
                </div>
            </div>
        </div>
    );
};

export default TicketStatus;
