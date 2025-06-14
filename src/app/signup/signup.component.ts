import { Component } from '@angular/core';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  public email = ''
  public password = ''
  public repeat = ''
  public userService = UserService.getInstance()

  constructor(private router: Router, private route: ActivatedRoute) {}

  public updateEmail(e: any) {
    this.email = e.target.value
  }

  public updatePassword(e: any) {
    this.password = e.target.value
  }

  public updateRepeat(e: any) {
    this.repeat = e.target.value
  }

  public doSignup() {
    if (this.email == '' || this.password == '' || this.repeat == '') {
      alert('All fields have to be complete')
      return
    }

    if (this.password != this.repeat) {
      alert('Passwords dont match!')
      return
    }

    try {
      this.userService.signup(this.email, this.password)
      this.router.navigate(['/login'], { relativeTo: this.route })
    } catch (e) {
      alert(e)
    }
  }
}
