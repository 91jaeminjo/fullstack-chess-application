package com.talentpath.chess.config;

import com.talentpath.chess.security.AuthTokenFilter;
import com.talentpath.chess.security.JwtAuthEntryPoint;
import com.talentpath.chess.security.UserDetailsServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@EnableWebSecurity
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {

    @Autowired
    UserDetailsServiceImpl userDetailsService;

    @Autowired
    JwtAuthEntryPoint entryPoint;

    //this exposes the parent class' AuthenticationManager
    //as a bean to be use later
    @Bean
    @Override
    public AuthenticationManager authenticationManagerBean() throws Exception {
        return super.authenticationManagerBean();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    //sets up the filter that will decode incoming jwts into
    //the basic username/password authentication tokens
    @Bean
    public AuthTokenFilter jwtFilter() {
        return new AuthTokenFilter();
    }

    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        super.configure(auth);
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
                .cors()
                .and()
                .csrf().disable()
                .exceptionHandling()
                .authenticationEntryPoint(entryPoint)
                .and()
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                .and()

                .authorizeRequests()

                .antMatchers(HttpMethod.POST, "/api/auth/signin").permitAll()
                .antMatchers(HttpMethod.POST, "/api/auth/signup").permitAll()

                .antMatchers(HttpMethod.GET, "/api/userdata", "/api/userdata/**").hasRole("ADMIN")
                .antMatchers(HttpMethod.POST, "/api/userdata").hasRole("ADMIN")
                .antMatchers(HttpMethod.PUT, "/api/userdata").hasRole("ADMIN")
                .antMatchers(HttpMethod.DELETE, "/api/userdata/**").hasRole("ADMIN")
                .antMatchers("/ws/**").permitAll()
                .anyRequest().authenticated().and()
                .addFilterBefore(jwtFilter(), UsernamePasswordAuthenticationFilter.class);

    }
}
