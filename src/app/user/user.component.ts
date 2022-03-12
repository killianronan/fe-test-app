import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../api.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort, Sort} from '@angular/material/sort';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'exads-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})

export class UserComponent implements OnInit, AfterViewInit {
  @ViewChild('usersTbSort', { static: false }) usersTbSort = new MatSort();
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  
  dataSource = new MatTableDataSource();
  displayedColumns = ["username", "first_name", "email", "id_status", "created_date"]
  usersList: any = [];
  sortedUsers: [];
  dataLoaded = false;
  selectedPageSize: string = "20";
  pageSizeOptions: Number[] = [10,20,50,100,200]

  constructor(private apiService:ApiService, private router:Router, private location: Location) { }

  ngOnInit() {
    this.getUsers();
  }
  ngAfterViewInit() {    
    this.dataSource.sort = this.usersTbSort;
  }

  navigateToCreateUser(){
    this.router.navigate(['users/create-user'], { state: { users: this.usersList, numUsers: this.usersList.length} })
  }

  getUsers(){
    let limit = 5000;
    if(this.location.getState()["numUsers"]){
      limit = this.location.getState()["numUsers"]
    }
    this.apiService.getUsers(limit).subscribe(data =>{
      this.usersList = data["data"];
      this.dataSource.data = this.usersList;
      this.dataSource.paginator = this.paginator;
      this.sortedUsers = this.usersList.slice();
      this.dataLoaded = true;
    }); 
  }

  setPageSize(event){
    if(event){
      this.selectedPageSize = event
      setTimeout(() =>{
        this.dataSource.paginator = this.paginator;
      },1000);
    }
  }
}
