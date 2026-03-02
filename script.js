const sheets = {
    rawData: [
        [
            "Date",
            "Brand",
            "Supplier",
            "Invoice No",
            "Product",
            "Qty",
            "Sales Amount",
            "Cost Amount",
            "Actual Margin %",
            "Configured Margin %",
            "EOSS %",
            "Net Margin %",
            "Margin Difference %",
            "Difference Amount",
            "Net Payout"
        ],
        [
            "2026-03-01",
            "Brand A",
            "Supplier X",
            "INV-001",
            "Notebook",
            "100",
            "50000",
            "42000",
            "=(G2-H2)/G2",
            "10%",
            "2%",
            "=I2+K2",
            "=L2-J2",
            "=G2*M2",
            "=G2-(G2*L2)"
        ]
    ],
    marginConfig: [
        ["Brand", "Supplier", "From Date", "To Date", "Configured Margin %", "Remarks"],
        ["Brand A", "Supplier X", "2026-03-01", "2026-03-31", "10%", "Monthly agreement"]
    ],
    eossScheme: [
        ["Brand", "Supplier", "Scheme Name", "From Date", "To Date", "EOSS %", "Remarks"],
        ["Brand A", "Supplier X", "End of Season", "2026-03-15", "2026-03-25", "2%", "Festival promo"]
    ],
    periodSummary: [
        [
            "Period From",
            "Period To",
            "Brand",
            "Supplier",
            "Total Sales",
            "Total Cost",
            "Actual Margin %",
            "Configured Margin %",
            "EOSS %",
            "Net Margin %",
            "Margin Difference %",
            "Difference Amount"
        ],
        [
            "2026-03-01",
            "2026-03-31",
            "Brand A",
            "Supplier X",
            "50000",
            "42000",
            "=(E2-F2)/E2",
            "10%",
            "2%",
            "=H2+I2",
            "=G2-J2",
            "=E2*K2"
        ]
    ]
};

function rowsToCsv(rows) {
    return rows
        .map((row) =>
            row
                .map((value) => {
                    const escaped = String(value).replace(/"/g, '""');
                    return /[",\n]/.test(escaped) ? `"${escaped}"` : escaped;
                })
                .join(",")
        )
        .join("\n");
}

function downloadCsv(fileName, rows) {
    const csvContent = rowsToCsv(rows);
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
}

function downloadAll() {
    downloadCsv("RawData.csv", sheets.rawData);
    setTimeout(() => downloadCsv("MarginConfig.csv", sheets.marginConfig), 150);
    setTimeout(() => downloadCsv("EOSS_Scheme.csv", sheets.eossScheme), 300);
    setTimeout(() => downloadCsv("Period_Summary.csv", sheets.periodSummary), 450);
}

document.querySelectorAll("button[data-sheet]").forEach((button) => {
    button.addEventListener("click", () => {
        const type = button.getAttribute("data-sheet");

        if (type === "all") {
            downloadAll();
            return;
        }

        const fileMap = {
            rawData: "RawData.csv",
            marginConfig: "MarginConfig.csv",
            eossScheme: "EOSS_Scheme.csv",
            periodSummary: "Period_Summary.csv"
        };

        downloadCsv(fileMap[type], sheets[type]);
    });
});
