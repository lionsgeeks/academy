<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Classes>
 */
class ClassesFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $types = ['coding', 'media'];
        $promos = [1, 2, 3, 4, 5];
        $classNums = [1, 2, 3, 4, 5];

        return [
            'central_id' => $this->faker->unique()->numberBetween(1000, 9999),
            'name' => $this->faker->sentence(2),
            'type' => $this->faker->randomElement($types),
            'promo' => $this->faker->randomElement($promos),
            'class' => $this->faker->randomElement($classNums),
            'start_time' => $this->faker->dateTimeThisYear(),
            'end_time' => $this->faker->dateTimeThisYear(),
        ];
    }
}
