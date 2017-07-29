System.register(['@angular/core'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1;
    var StudyListComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            }],
        execute: function() {
            //import { TableData } from './table-data';
            // webpack html imports
            //let template = require('.app/table-demo.html');
            StudyListComponent = (function () {
                function StudyListComponent() {
                    this.rows = [];
                    this.columns = [
                        { title: 'Name', name: 'name', filtering: { filterString: '', placeholder: 'Filter by name' } },
                        {
                            title: 'Position',
                            name: 'position',
                            sort: false,
                            filtering: { filterString: '', placeholder: 'Filter by position' }
                        },
                        { title: 'Office', className: ['office-header', 'text-success'], name: 'office', sort: 'asc' },
                        { title: 'Extn.', name: 'ext', sort: '', filtering: { filterString: '', placeholder: 'Filter by extn.' } },
                        { title: 'Start date', className: 'text-warning', name: 'startDate' },
                        { title: 'Salary ($)', name: 'salary' }
                    ];
                    this.page = 1;
                    this.itemsPerPage = 10;
                    this.maxSize = 5;
                    this.numPages = 1;
                    this.length = 0;
                    this.config = {
                        paging: true,
                        sorting: { columns: this.columns },
                        filtering: { filterString: '' },
                        className: ['table-striped', 'table-bordered']
                    };
                    this.length = this.data.length;
                }
                StudyListComponent.prototype.ngOnInit = function () {
                    this.onChangeTable(this.config);
                };
                StudyListComponent.prototype.changePage = function (page, data) {
                    if (data === void 0) { data = this.data; }
                    var start = (page.page - 1) * page.itemsPerPage;
                    var end = page.itemsPerPage > -1 ? (start + page.itemsPerPage) : data.length;
                    return data.slice(start, end);
                };
                StudyListComponent.prototype.changeSort = function (data, config) {
                    if (!config.sorting) {
                        return data;
                    }
                    var columns = this.config.sorting.columns || [];
                    var columnName = void 0;
                    var sort = void 0;
                    for (var i = 0; i < columns.length; i++) {
                        if (columns[i].sort !== '' && columns[i].sort !== false) {
                            columnName = columns[i].name;
                            sort = columns[i].sort;
                        }
                    }
                    if (!columnName) {
                        return data;
                    }
                    // simple sorting
                    return data.sort(function (previous, current) {
                        if (previous[columnName] > current[columnName]) {
                            return sort === 'desc' ? -1 : 1;
                        }
                        else if (previous[columnName] < current[columnName]) {
                            return sort === 'asc' ? -1 : 1;
                        }
                        return 0;
                    });
                };
                StudyListComponent.prototype.changeFilter = function (data, config) {
                    var _this = this;
                    var filteredData = data;
                    this.columns.forEach(function (column) {
                        if (column.filtering) {
                            filteredData = filteredData.filter(function (item) {
                                return item[column.name].match(column.filtering.filterString);
                            });
                        }
                    });
                    if (!config.filtering) {
                        return filteredData;
                    }
                    if (config.filtering.columnName) {
                        return filteredData.filter(function (item) {
                            return item[config.filtering.columnName].match(_this.config.filtering.filterString);
                        });
                    }
                    var tempArray = [];
                    filteredData.forEach(function (item) {
                        var flag = false;
                        _this.columns.forEach(function (column) {
                            if (item[column.name].toString().match(_this.config.filtering.filterString)) {
                                flag = true;
                            }
                        });
                        if (flag) {
                            tempArray.push(item);
                        }
                    });
                    filteredData = tempArray;
                    return filteredData;
                };
                StudyListComponent.prototype.onChangeTable = function (config, page) {
                    if (page === void 0) { page = { page: this.page, itemsPerPage: this.itemsPerPage }; }
                    if (config.filtering) {
                        Object.assign(this.config.filtering, config.filtering);
                    }
                    if (config.sorting) {
                        Object.assign(this.config.sorting, config.sorting);
                    }
                    var filteredData = this.changeFilter(this.data, this.config);
                    var sortedData = this.changeSort(filteredData, this.config);
                    this.rows = page && config.paging ? this.changePage(page, sortedData) : sortedData;
                    this.length = sortedData.length;
                };
                StudyListComponent.prototype.onCellClick = function (data) {
                    console.log(data);
                };
                StudyListComponent = __decorate([
                    core_1.Component({
                        selector: 'table-demo',
                        templateUrl: '.app/table-demo.html'
                    }), 
                    __metadata('design:paramtypes', [])
                ], StudyListComponent);
                return StudyListComponent;
            }());
            exports_1("StudyListComponent", StudyListComponent);
        }
    }
});
//# sourceMappingURL=studyList.component.js.map