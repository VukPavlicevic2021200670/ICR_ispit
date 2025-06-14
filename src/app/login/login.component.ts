import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  public email = ''
  public password = ''
  public userService = UserService.getInstance()

  constructor(private router: Router, private route: ActivatedRoute) { }

  public updateEmail(e: any) {
    this.email = e.target.value
  }

  public updatePassword(e: any) {
    this.password = e.target.value
  }

  public doLogin() {
    this.route.queryParams.subscribe(params => {
      const fromRoute = params['from']

      if (this.email == '' || this.password == '') {
        alert('Username or password is empty')
        return
      }

      try {
        this.userService.login(this.email, this.password)
        this.router.navigate([fromRoute ? fromRoute : '/profile'], { relativeTo: this.route })
      } catch (e) {
        alert(e)
      }
    })
  }
}
