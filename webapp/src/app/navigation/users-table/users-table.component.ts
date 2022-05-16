import { Component, OnInit } from '@angular/core';
import { ColDef } from 'ag-grid-community';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-users-table',
  templateUrl: './users-table.component.html',
  styleUrls: ['./users-table.component.scss']
})
export class UsersTableComponent implements OnInit {

  columnDefs: ColDef[] = [
    { field: 'id', sortable: true, filter: true },
    { field: 'username', sortable: true, filter: true },
    { field: 'admin', sortable: true, filter: true }
  ];

  rowData: Array<{
    id: string;
    username: string;
    admin: boolean,
  }> = [];

  constructor(private usersService: UsersService) {
    this.usersService.getUsersList().subscribe(resp => {
      this.rowData = Object.keys(resp).map((key) => {
        return {
          id: resp[key]._id,
          username: resp[key].username,
          admin: resp[key].admin
        }
      })
    })
  }

  ngOnInit(): void {
  }

}
