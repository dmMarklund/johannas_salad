import { useState, useEffect } from "react";
import { Bar, Line } from "recharts"; //Do not forget to add other graphical components depentind on graph type.

//custom hook for fetch, filter and process data to graphics.
//Must be expanded if you want to use different kind of graphics and sortings.
//But it is easy to do.

const useGraphData = (itemNameProp) => {
  // pass general prop to function
  const [items, setItems] = useState([]);
  const [yearMultiArray, setYearMultiArray] = useState([]);
  const [selectedItemNames, setSelectedItemNames] = useState([]);
  const [selectedYear, setSelectedYear] = useState([]);
  const [selectedWeekNumbers, setSelectedWeekNumbers] = useState([]);
  const [availableItemNames, setAvailableItemNames] = useState([]);
  const [availableWeekNumbers, setAvailableWeekNumbers] = useState([]);
  const [dataReady, setDataReady] = useState(false);
  const [graphData, setGraphData] = useState([]);
  const [graphDataChartType, setGraphDataChartType] = useState([]);
  const [sortColumn, setSortColumn] = useState(itemNameProp);
  const [sortDirection, setSortDirection] = useState("asc");

  //get base array
  useEffect(() => {
    async function fetchData() {
      const apiUrl = `http://159.89.110.54:4000/api/data/salads`;
      const token = localStorage.getItem("token");

      if (!token) {
        console.log("Authentication required");
        return;
      }

      try {
        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setItems(data);
        } else {
          console.error(`Failed to fetch salads`);
        }
      } catch (error) {
        console.error(`Error fetching salads:`, error);
      }
    }

    fetchData();
  }, [items]);

  //sort years from array, 2022, 2023 etc

  useEffect(() => {
    if (items) {
      const uniqueYear = [...new Set(items.map(({ year }) => year))];
      const yearMultiArray_ = uniqueYear.map((year) => ({
        label: year,
        value: year,
      }));
      setYearMultiArray(yearMultiArray_);
    }
  }, [items]);

  //when we get a single year, get a first item(salad name, orsak) and weeks

  useEffect(() => {
    if (selectedYear.value) {
      const yearValue = selectedYear.value;
      const filteredItems = items.filter((item) => item.year === yearValue);
      const uniqueItemNames = [
        ...new Set(
          filteredItems.map(({ [itemNameProp]: itemName }) => itemName)
        ),
      ];
      const uniqueWeekNumbers = [
        ...new Set(filteredItems.map(({ weekNumber }) => weekNumber)),
      ];

      const itemMultiArray_ = uniqueItemNames.map((itemName) => ({
        label: itemName,
        value: itemName,
      }));
      const weekNumberMultiArray_ = uniqueWeekNumbers.map((weekNumber) => ({
        label: `Week ${weekNumber}`,
        value: weekNumber,
      }));

      setAvailableItemNames(itemMultiArray_);
      setAvailableWeekNumbers(weekNumberMultiArray_);
    }
  }, [selectedYear, items, itemNameProp]);

  //update function, it helps to update everything when we select new items

  useEffect(() => {
    if (selectedItemNames.length > 0 && selectedWeekNumbers.length > 0) {
      setDataReady(true);
    } else {
      setDataReady(false);
    }
  }, [selectedItemNames, selectedWeekNumbers]);

  //like here we update graph on the air

  useEffect(() => {
    if (dataReady) {
      generateGraph();
    }
  }, [dataReady, selectedItemNames, selectedWeekNumbers, itemNameProp]);

  // get values for our selection items
  const filterData = () => {
    return items.filter(
      (item) =>
        (!selectedYear.length || selectedYear[0].value === item.year) &&
        (!selectedItemNames.length ||
          selectedItemNames.some(
            (selected) => selected.value === item[itemNameProp]
          )) &&
        (!selectedWeekNumbers.length ||
          selectedWeekNumbers.some(
            (selected) => selected.value === item.weekNumber
          ))
    );
  };

  //on click for both table and graph
  const generateGraph = () => {
    //clean everything at the start
    if (selectedItemNames.length === 0 || selectedWeekNumbers.length === 0) {
      setGraphData([]);
      setGraphDataChartType([]);
      return;
    }

    const filteredData = filterData();
    const result = {};

    filteredData.forEach((item) => {
      const weekKey = item.weekNumber;
      const itemName = item[itemNameProp];
      const rensade = item.rensade;

      result[weekKey] = result[weekKey] || {};
      result[weekKey][itemName] = (result[weekKey][itemName] || 0) + rensade;
    });

    const graphData_ = [];

    //from our array we need to create array with special structure to future use for
    //data table building
    //it must look like :
    //[
    //  {
    //        "itemName": "Dill - Hera" or "Svinn", - our selected item, depending av what we want to filter
    //        "rensade": 15,
    //        "weekNumber": 30
    //    }
    //]

    for (const weekNumber in result) {
      for (const itemName in result[weekNumber]) {
        graphData_.push({
          itemName: itemName,
          rensade: result[weekNumber][itemName],
          weekNumber: parseInt(weekNumber, 10),
        });
      }
    }

    setGraphData(graphData_);

    //and for graphs we nedd to change it to:
    //[
    // {
    //   weekNumber: 30,
    //   "Dill - Hera": 15,
    // }
    //];

    const graphDataChartType_ = Object.keys(result).map((weekNumber) => ({
      weekNumber: parseInt(weekNumber, 10),
      ...result[weekNumber],
    }));

    setGraphDataChartType(graphDataChartType_);
    if (graphDataChartType_.length === 0) {
      console.log("No Bar data");
      return;
    }
  };

  //Select triggers START
  const handleYearChange = (selectedYear) => {
    setSelectedYear(selectedYear);
    setSelectedItemNames([]);
    setSelectedWeekNumbers([]);
    setDataReady(false);
  };

  const handleItemChange = (selectedItemNames) => {
    setSelectedItemNames(selectedItemNames);
  };

  const handleWeekChange = (selectedWeekNumbers) => {
    setSelectedWeekNumbers(selectedWeekNumbers);
  };

  // END--

  //table sorting

  const handleSort = (column) => {
    const isSameColumn = column === sortColumn;
    const newSortDirection = isSameColumn
      ? sortDirection === "asc"
        ? "desc"
        : "asc"
      : "asc";

    setSortColumn(column);
    setSortDirection(newSortDirection);

    const sortedData = [...graphData];
    sortedData.sort((a, b) => {
      const columnValueA = getColumnValue(a, column);
      const columnValueB = getColumnValue(b, column);

      if (typeof columnValueA === "string") {
        return newSortDirection === "asc"
          ? columnValueA.localeCompare(columnValueB)
          : columnValueB.localeCompare(columnValueA);
      } else {
        return newSortDirection === "asc"
          ? columnValueA - columnValueB
          : columnValueB - columnValueA;
      }
    });

    setGraphData(sortedData);
  };

  //now with switch for easier future changes
  const getColumnValue = (item, column) => {
    switch (column) {
      case "saladName":
        return item.itemName || "";
      case "orsak":
        return item.itemName || "";
      case "rensade":
        return item.rensade || 0;
      case "weekNumber":
        return item.weekNumber || 0;
      default:
        return "";
    }
  };

  //this variables for graph values, one for Bar chart, one for Line chart

  const renderBarElements = () => {
    return Object.keys(graphDataChartType[0])
      .filter((key) => key !== "weekNumber")
      .map((itemName, index) => (
        <Bar
          key={index}
          dataKey={itemName}
          fill={`hsl(${index * 60}, 70%, 50%)`}
        />
      ));
  };

  const renderLineElements = () => {
    return Object.keys(graphDataChartType[0])
      .filter((key) => key !== "weekNumber")
      .map((itemName, index) => (
        <Line
          key={index}
          type="monotone"
          dataKey={itemName}
          stroke={`hsl(${index * 60}, 70%, 50%)`}
        />
      ));
  };

  //custom hook for graph tick, XAxis

  const CustomXAxisTick = ({ x, y, payload }) => {
    const index = payload.index;
    const dataPoint = graphDataChartType[index];
    const weekNumber = dataPoint.weekNumber;

    return (
      <g transform={`translate(${x},${y})`}>
        <text x={0} y={0} dy={16} textAnchor="middle" fill="#666">
          {"Week " + weekNumber}
        </text>
      </g>
    );
  };

  return {
    items,
    yearMultiArray,
    selectedItemNames,
    selectedYear,
    selectedWeekNumbers,
    availableItemNames,
    availableWeekNumbers,
    dataReady,
    graphData,
    graphDataChartType,
    sortColumn,
    sortDirection,
    handleYearChange,
    handleItemChange,
    handleWeekChange,
    handleSort,
    renderBarElements,
    renderLineElements,
    generateGraph,
    CustomXAxisTick,
  };
}; // do not forget to add more items like new renderXElements in future

export default useGraphData;
