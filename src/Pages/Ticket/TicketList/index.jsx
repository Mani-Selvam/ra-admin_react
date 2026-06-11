import React from "react";
import TicketList from "@/Components/TicketDash/TicketList";

const Ticket = () => {
    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-12">
                    <TicketList />
                </div>
            </div>
        </div>
    );
};

export default Ticket;
