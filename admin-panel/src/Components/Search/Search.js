import React from "react";
import "./Search.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faSortDown,
<<<<<<< HEAD
  faSortUp,
=======
>>>>>>> 7ccd0bf1d2cc01765fbfba369bcc659ee2143924
  faKey,
  faChalkboard,
  faArrowLeft,
  faArrowRight
} from "@fortawesome/free-solid-svg-icons";
import { Table } from "reactstrap";
import { GetSearchResult, SafeValue } from "../ApiHandler/ApiHandler";
import Spinner from "../Tools/Spinner/Spinner";
<<<<<<< HEAD
import Header from "../Layout/Header";
import classnames from "classnames";
import UpdateParams from "../Tools/UpdateParams/UpdateParams";
=======
import classnames from "classnames";
>>>>>>> 7ccd0bf1d2cc01765fbfba369bcc659ee2143924
export default class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      totalEntries: 0,
      sort: "asc",
      tableInfoData: [],
<<<<<<< HEAD
      isUserSearching: false,
      pageSize: 10,
=======
      isUserTyping: false,
>>>>>>> 7ccd0bf1d2cc01765fbfba369bcc659ee2143924
      pagination: {
        current_page: 1,
        next_page: null,
        prev_page: null,
        total_entries: 0,
        total_pages: 1
<<<<<<< HEAD
      }
=======
      },
      searchedValue: ""
>>>>>>> 7ccd0bf1d2cc01765fbfba369bcc659ee2143924
    };
    this.searchInput = React.createRef();
  }
  //if you send a value to this function as second argument this operation called force search
<<<<<<< HEAD

  doSearch = (searchElement, params = {}) => {
    const { pageSize } = this.state;
    let paramString = "";
    //checking force search
    if (searchElement !== null) {
      //operation goes here only when user starts typing
      params.search = searchElement.target.value;
    }
    if (params.search !== undefined) {
      params = { search: params.search, "page[size]": pageSize };
      paramString = UpdateParams(params, {});
      this.setState({ sort: "asc" });
    } else {
      const searchValue = SafeValue(
        this.urlParser(window.location.search),
        "search",
        "string",
        ""
      );
      params = {
        search: searchValue,
        ...params,
        "page[size]": pageSize
      };
      paramString = UpdateParams(params, window.location.search);
    }
    this.setState({ isUserSearching: true });
    GetSearchResult(paramString, item => {
=======
  doSearch = (searchElement, forcedValue) => {
    let searchValue = "";
    //checking force search
    if (forcedValue === undefined) {
      //operation goes here only when user starts typing
      searchValue = searchElement.target.value;
      this.setState({ isUserTyping: true });
    } else {
      searchValue = forcedValue;
    }
    searchValue = searchValue.toString();
    GetSearchResult({ search: searchValue }, item => {
>>>>>>> 7ccd0bf1d2cc01765fbfba369bcc659ee2143924
      if (item.success_result.success) {
        this.setState(
          {
            tableInfoData: SafeValue(item, "data.included", "object", []),
<<<<<<< HEAD
            searchedValue: params.search,
            isUserSearching: false,
            pagination: SafeValue(item, "data.meta", "object", {})
          },
          () => this.updateUrl(paramString)
=======
            searchedValue: searchValue,
            isUserTyping: false,
            pagination: SafeValue(item, "data.meta", "object", {})
          },
          () => console.log("state:", this.state)
>>>>>>> 7ccd0bf1d2cc01765fbfba369bcc659ee2143924
        );
      }
    });
  };
  generateTableInfo = () => {
    const { tableInfoData } = this.state;
    const rows = [];
    let name, art;
    if (tableInfoData.length > 0) {
      tableInfoData.forEach((info, idx) => {
        name = SafeValue(info, "attributes.label", "string", "No Specified");
        //if data of art was not reliable and true then return a default icon
        art = SafeValue(
          info,
          "type",
          "string",
          <FontAwesomeIcon icon={faSortDown} size="1x" color="whitesmoke" />
        );
        rows.push(
          <tr key={idx}>
<<<<<<< HEAD
            <td className={art}>
=======
            <td>
>>>>>>> 7ccd0bf1d2cc01765fbfba369bcc659ee2143924
              {art === "authorization_roles" ? (
                <FontAwesomeIcon icon={faKey} size="lg" color="grey" />
              ) : (
                <FontAwesomeIcon icon={faChalkboard} size="lg" color="grey" />
              )}
            </td>
<<<<<<< HEAD
            <td className="name">{name}</td>
=======
            <td>{name}</td>
>>>>>>> 7ccd0bf1d2cc01765fbfba369bcc659ee2143924
          </tr>
        );
      });
    } else {
      rows.push(
        <tr key={0}>
          <td style={{ border: "none" }}>&nbsp;</td>
          <td>
            <span style={{ marginLeft: "39%" }}>Kein Ergebnis</span>
          </td>
        </tr>
      );
    }
    return rows;
  };
  generatePaginationItems = () => {
    const { total_pages, current_page, total_entries } = this.state.pagination;
    const generatedItems = [];
    if (total_entries > 0) {
      for (let i = 1; i <= total_pages; i++) {
        generatedItems.push(
          <span
<<<<<<< HEAD
            key={i}
            className="pageButton"
            onClick={() => current_page !== i && this.doPagination(null, i)}
          >
            <button className={classnames(current_page === i && "active")}>
              {i}
            </button>
=======
            className={classnames("pageButton", current_page === i && "active")}
          >
            {i}
>>>>>>> 7ccd0bf1d2cc01765fbfba369bcc659ee2143924
          </span>
        );
      }
    }
    return generatedItems;
  };
<<<<<<< HEAD

  updateUrl = newSearch => {
    this.props.history.push(newSearch);
  };
  doSort = type => {
    let { sort } = this.state;
    //reversing sort direction
    switch (sort) {
      case "asc":
        sort = "desc";
        break;
      case "desc":
        sort = "asc";
        break;
      default:
        break;
    }

    this.setState({ sort: sort }, () => {
      this.doSearch(null, { sort_direction: sort, sort_type: type });
    });
  };
  doPagination = (type, page) => {
    let {
      current_page,
      next_page,
      prev_page,
      total_pages
    } = this.state.pagination;
    let pagination;
    switch (type) {
      case "next":
        pagination = next_page;
        break;
      case "prev":
        pagination = prev_page;
        break;
      default:
        pagination = page;
    }
    this.doSearch(null, {
      "page[number]": pagination
    });
  };
  urlParser = url => {
    const params = new URLSearchParams(url);
    const paramsObj = {};
    for (const [key, value] of params.entries()) {
      paramsObj[key] = value;
    }
    return paramsObj;
  };

  componentDidMount() {
    this.doSearch(null, this.urlParser(window.location.search));
  }

  render() {
    const { isUserSearching, pagination, searchedValue, sort } = this.state;
=======
  handleUrl = () => {};
  doSort = () => {
    GetSearchResult({}, item => {
      if (item.success_result.success) {
        console.log(item);
        this.setState(
          {
            totalEntries: SafeValue(
              item,
              "data.meta.total_entries",
              "number",
              0
            )
          },
          () => console.log(this.state)
        );
      }
    });
  };
  doPaginate = type => {
    let pagination_type = false;
    switch (type) {
      case "next":
        break;
      case "prev":
        break;
        break;
      default:
    }
    if (!type) {
      GetSearchResult({}, item => {
        console.log(item);
        if (item.success_result.success) {
          this.setState(
            {
              totalEntries: SafeValue(
                item,
                "data.meta.total_entries",
                "number",
                0
              )
            },
            () => console.log(this.state)
          );
        }
      });
    }
  };
  componentDidMount() {
    this.doSearch(null, "");
  }

  render() {
    const { isUserTyping, pagination, searchedValue } = this.state;
>>>>>>> 7ccd0bf1d2cc01765fbfba369bcc659ee2143924
    return (
      <div className="Search">
        {/* Search Section Elements */}
        <Header>
          <div className="logoTitle-box">
            <strong className="logoTitle">Admin Tool</strong>
          </div>
          <div className="searchField-box">
            <span className="searchIcon-wrapper">
              <FontAwesomeIcon
                icon={faSearch}
                pull="left"
                size="lg"
                color="whitesmoke"
              />
            </span>
            <input
              type="text"
              className="searchField"
              onChange={this.doSearch}
              ref={this.searchInput}
            />
            <span
              className={classnames(
                "searchButton-wrapper",
<<<<<<< HEAD
                !isUserSearching && "active"
              )}
            >
              <button
                disabled={isUserSearching}
                onClick={() => this.doSearch(null, { search: searchedValue })}
              >
                {isUserSearching ? <Spinner /> : "SUCHEN"}
=======
                !isUserTyping && "active"
              )}
            >
              <button
                disabled={isUserTyping}
                onClick={() => this.doSearch(null, searchedValue)}
              >
                {isUserTyping ? <Spinner /> : "SUCHEN"}
>>>>>>> 7ccd0bf1d2cc01765fbfba369bcc659ee2143924
              </button>
            </span>
          </div>
          <div className="addNewRecord-box">
            <a
              className="addNewRecord"
              onClick={() => this.props.history.push("/addnewrecord")}
            >
              +
            </a>
          </div>
        </Header>

        {/* Body Section */}
        <div className="searchBody-section">
          <div className="menu-section">menu section</div>
          <div className="contentBody-section">
            <div className="dataInfoTable-section">
              <span className="resultCount">
                {pagination.total_entries} Ergebnisse gefunden
              </span>
              <Table>
                <thead>
                  <tr>
                    <th>Art</th>
<<<<<<< HEAD
                    <th onClick={() => this.doSort("label")} className="sort">
                      Name{" "}
                      {sort === "asc" ? (
                        <FontAwesomeIcon icon={faSortDown} size="1x" />
                      ) : (
                        <FontAwesomeIcon icon={faSortUp} size="1x" />
                      )}
=======
                    <th>
                      Name{" "}
                      <FontAwesomeIcon
                        icon={faSortDown}
                        size="1x"
                        color="whitesmoke"
                      />
>>>>>>> 7ccd0bf1d2cc01765fbfba369bcc659ee2143924
                    </th>
                  </tr>
                </thead>
                <tbody>{this.generateTableInfo()}</tbody>
              </Table>
              <div className="tablePagination-section">
                <span
<<<<<<< HEAD
                  onClick={() => this.doPagination("prev")}
=======
>>>>>>> 7ccd0bf1d2cc01765fbfba369bcc659ee2143924
                  className={classnames(
                    "prev",
                    "navigation",
                    pagination.prev_page === null && "deactive"
                  )}
                >
                  <FontAwesomeIcon icon={faArrowLeft} size="1x" pull="left" />
                  Vorherige
                </span>
                <div className="pageButton-wrapper">
                  {this.generatePaginationItems()}
                </div>
                <span
<<<<<<< HEAD
                  onClick={() => this.doPagination("next")}
=======
>>>>>>> 7ccd0bf1d2cc01765fbfba369bcc659ee2143924
                  className={classnames(
                    "prev",
                    "navigation",
                    pagination.next_page === null && "deactive"
                  )}
                >
                  <FontAwesomeIcon icon={faArrowRight} size="1x" pull="right" />
                  Nächste
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
