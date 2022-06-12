import { Component, OnInit, ViewChild } from '@angular/core';
import { ColDef, GridOptions } from 'ag-grid-community';
import { UsersService } from 'src/app/services/users.service';
import { Modal } from 'bootstrap';
import { BtnCellRendererComponent } from 'src/app/ui/btn-cell-renderer/btn-cell-renderer.component';

@Component({
  selector: 'app-users-table',
  templateUrl: './users-table.component.html',
  styleUrls: ['./users-table.component.scss']
})
export class UsersTableComponent implements OnInit {

  modalDirect: Modal | undefined = undefined;
  @ViewChild('addUserModal') input: any;

  columnDefs: ColDef[] = [
    { field: 'username', headerName: 'Username', sortable: true, filter: true },
    { field: 'admin', headerName: 'Is Admin?', sortable: true, filter: true },
    {
      field: 'id', cellRenderer: 'btnCellRenderer',
      headerName: 'Action',
      cellRendererParams: {
        clicked: (field: string) => {
          const user = this.rowData.find(u => u.id === field);
          const hasConfirmed = confirm(`Do you really want to delete user ${user?.username} ?`);
          if (hasConfirmed) {
            this.usersService.deleteUser(user?.id as string).subscribe((r) => {
              alert(r?.message);
              this.getUsersData();
            });
          }
        },
      },
    },
  ];

  rowData: Array<{
    id: string;
    username: string;
    admin: boolean,
  }> = [];

  gridOptions: GridOptions = {
    components: {
      btnCellRenderer: BtnCellRendererComponent,
    },
  };

  username = ''
  password = '';
  isAdmin = false;

  constructor(private usersService: UsersService) { }

  ngOnInit(): void {
    this.getUsersData();
  }

  get formValid() {
    return this.username.length > 3 && this.password.length > 7;
  }

  openNewUserModal(element: any): void {
    this.modalDirect = new Modal(element, {});
  }

  save() {
    console.log(this.username, this.password, this.isAdmin);
    this.usersService.addUser({
      username: this.username,
      password: this.password,
      admin: this.isAdmin,
    }).subscribe((resp) => {
      alert(resp?.message);
      this.getUsersData();
      this.resetNewUserForm();
    });
  }

  getUsersData() {
    this.usersService.getUsersList().subscribe(resp => {
      this.rowData = Object.keys(resp).map((key) => {
        return {
          id: resp[key]._id,
          username: resp[key].username,
          admin: resp[key].admin
        }
      })
    });
  }

  resetNewUserForm() {
    this.username = ''
    this.password = '';
    this.isAdmin = false;
  }

}
