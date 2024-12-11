//--Format Date as MM/DD/YYYY
function formatDate(date: Date): string {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(date).toLocaleDateString("en-US", options);
  }
  
  //--Capitalize first letter
  function capitalize(str: string): string {
    if(typeof str !== "string" || str.length === 0) {
      return str;
    }
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  
  export { formatDate, capitalize };