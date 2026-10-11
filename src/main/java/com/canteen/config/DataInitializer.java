package com.canteen.config;

import com.canteen.model.MenuItem;
import com.canteen.model.Role;
import com.canteen.model.User;
import com.canteen.repository.MenuItemRepository;
import com.canteen.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final MenuItemRepository menuItemRepository;

    public DataInitializer(UserRepository userRepository, MenuItemRepository menuItemRepository) {
        this.userRepository = userRepository;
        this.menuItemRepository = menuItemRepository;
    }

    @Override
    public void run(String... args) {
        // Seed Default Users
        if (userRepository.count() == 0) {
            userRepository.save(new User("21CS101", "1234", "Aarav Sharma", Role.STUDENT));
            userRepository.save(new User("21CS102", "1234", "Priya Patel", Role.STUDENT));
            userRepository.save(new User("OWNER01", "admin123", "Chef Ramesh (Canteen Manager)", Role.OWNER));
        }

        // Seed Sample Delicious Canteen Menu
        if (menuItemRepository.count() == 0) {
            menuItemRepository.save(new MenuItem("Crispy Samosa (2 pcs)", "Snacks", 30.0, "Fresh spiced potato filling with tamarind chutney", "🥟"));
            menuItemRepository.save(new MenuItem("Masala Dosa", "Meals", 70.0, "Crisp golden crepe with spiced potato filling & coconut chutney", "🥞"));
            menuItemRepository.save(new MenuItem("Cold Coffee", "Beverages", 50.0, "Thick creamy chilled coffee with chocolate drizzle", "🧋"));
            menuItemRepository.save(new MenuItem("Veg Cheese Burger", "Snacks", 65.0, "Crispy veggie patty with molten cheese & house sauce", "🍔"));
            menuItemRepository.save(new MenuItem("Paneer Kathi Roll", "Snacks", 80.0, "Spiced paneer cubes rolled in crisp flaky paratha", "🌯"));
            menuItemRepository.save(new MenuItem("Special Thali", "Meals", 110.0, "2 Rotis, Paneer Sabzi, Dal, Jeera Rice, Gulab Jamun", "🍱"));
            menuItemRepository.save(new MenuItem("Kulhad Masala Chai", "Beverages", 20.0, "Cardamom-ginger infused piping hot tea in earthen cup", "☕"));
            menuItemRepository.save(new MenuItem("Veg Hakka Noodles", "Meals", 75.0, "Wok-tossed noodles with bell peppers and crunchies", "🍜"));
        }
    }
}
